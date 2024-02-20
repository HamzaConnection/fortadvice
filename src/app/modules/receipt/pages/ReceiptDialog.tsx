import { useMemo, useState } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { add, allocate, Dinero } from "dinero.js"
import { StandardTopbarTitle } from "../../../shared/components/skeleton/TopBar"
import { StandardDialog } from "../../../shared/components/dialogs/StandardDialog"
import { useApiQuery } from "../../../core/api/useApiQuery"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { DateTimeFactory, useDateTime } from "../../localization/useDateTime"
import { BuyerParty, IMyOrderDetails, IOrderLine } from "../../payments/orderTypes"
import { COMPANY_PAYMENT_METHOD, PaymentMethodType } from "../../payments/paymentTypes"
import { getOrderDetails, GetOrderDetailsResponse } from "../ordersApi"
import { Comment, HeaderSection, ReceiptContainer } from "../components/ReceiptBlocks"
import { getPaymentMethodType, PurchaseDetailsSection } from "../components/PurchaseDetailsSection"
import { DeliveryDetailsSection } from "../components/DeliveryDetailsSection"
import { DineroOrderLine, FlatOrderLineGroup, OrderDetailsSection } from "../components/OrderDetailsSection"
import { ActionsSection } from "../components/ActionsSection"
import { ForwardReceiptDrawer } from "../components/ForwardReceiptDrawer"
import { ErrorView } from "../../../shared/components/errors/ErrorView"
import GeneralErrorAnim from "../../../shared/assets/general-error-lottie-anim.json"
import { toCurrency, toDineroOrUndefined, zeroDinero } from "../../currency/currencyLib"

type GroupedOrderLines = Record<BuyerParty, Record<PaymentMethodType, IOrderLine[]>>

function getLoadedOrder(orderResponse: UseQueryResult<GetOrderDetailsResponse>): IMyOrderDetails | undefined {
    return orderResponse.isLoading || orderResponse.isError ? undefined : orderResponse.data.orders[0]
}

function getOrderDisplayName(orderId: number, orderResponse: UseQueryResult<GetOrderDetailsResponse>) {
    return getLoadedOrder(orderResponse)?.displayName ?? `#${orderId}`
}

function getPaymentDetails(orderResponse: UseQueryResult<GetOrderDetailsResponse>) {
    return getLoadedOrder(orderResponse)?.paymentDetails
}

function getKitchen(orderResponse: UseQueryResult<GetOrderDetailsResponse>) {
    return getLoadedOrder(orderResponse)?.kitchen
}

function getCustomer(orderResponse: UseQueryResult<GetOrderDetailsResponse>) {
    return getLoadedOrder(orderResponse)?.organizers?.[0]
}

function getTimeOfPurchase(orderResponse: UseQueryResult<GetOrderDetailsResponse>, dateTimeFactory: DateTimeFactory) {
    const created = getLoadedOrder(orderResponse)?.created
    return created ? dateTimeFactory.fromApi(created) : undefined
}

function getDelivery(orderResponse: UseQueryResult<GetOrderDetailsResponse>) {
    return getLoadedOrder(orderResponse)?.deliveries?.[0]
}

function getDeliveryComment(orderResponse: UseQueryResult<GetOrderDetailsResponse>): Comment | undefined {
    const loadedOrder = getLoadedOrder(orderResponse)
    if (!loadedOrder) return undefined

    const loadedComment = loadedOrder.deliveries?.[0].orderNote
    if (!loadedComment || loadedComment.trim() === "") return { present: false }

    return { present: true, text: loadedComment }
}

function getOrderLinePaymentMethod(line: IOrderLine, orderPaymentMethod: PaymentMethodType) {
    if (line.paymentDetails?.method) return line.paymentDetails.method
    if (line.buyerParty === BuyerParty.COMPANY) return COMPANY_PAYMENT_METHOD
    return getPaymentMethodType(orderPaymentMethod)
}

function getIncludedVAT2(totalPrice: Dinero<number>) {
    const dkVatRate = 25  // TODO: Need to take from response when available
    const [totalBeforeVat, vat] = allocate(totalPrice, [100-dkVatRate, dkVatRate])
    return vat
}
function getIncludedVAT(totalPrice: number) {
    const dkVatRate = 0.25
    const vatMultiplier = 1 + dkVatRate
    const priceWithoutVat = totalPrice / vatMultiplier
    return totalPrice - priceWithoutVat
}

function getGroupedOrderLines(orderResponse: UseQueryResult<GetOrderDetailsResponse>) {
    const loadedOrder = getLoadedOrder(orderResponse)
    // Todays orders does not contain payment methods for order
    if (!loadedOrder) return undefined

    const orderLines = loadedOrder.deliveries?.[0].orderLines
    if (!orderLines) return undefined

    if (!loadedOrder.paymentDetails?.method) return undefined
    const orderPaymentMethod = loadedOrder.paymentDetails.method

    return orderLines.reduce((acc, line) => {
        if (line.buyerParty) {
            const paymentMethod = getOrderLinePaymentMethod(line, orderPaymentMethod)

            let buyerPartyGroups = acc[line.buyerParty]
            if (!buyerPartyGroups) {
                buyerPartyGroups = {} as Record<PaymentMethodType, IOrderLine[]>
                acc[line.buyerParty] = buyerPartyGroups
            }

            let paymentMethodLines = buyerPartyGroups[paymentMethod]
            if (!paymentMethodLines) {
                paymentMethodLines = []
                buyerPartyGroups[paymentMethod] = paymentMethodLines
            }

            paymentMethodLines.push(line)
        }
        return acc
    }, {} as GroupedOrderLines)
}

function toDineroOrderLine(line: IOrderLine) {
    const price = toDineroOrUndefined(line.price)

    const result: DineroOrderLine = {
        ...line,
        price,
    }

    return result
}

function flattenGroupedOrderLines(orderLines: GroupedOrderLines | undefined) {
    if (!orderLines) return undefined

    // TODO: Take currency from response
    const zero = zeroDinero(toCurrency("DKK"))

    return Object.entries(orderLines).reduce((allGroups, [buyerParty, group]) => {
        return Object.entries(group).reduce((bpGroups, [paymentMethod, ol]) => {
            const totalPrice = ol.reduce((sum, line) => add(sum, toDineroOrUndefined(line.price) ?? zero), zero)
            const includedVAT = getIncludedVAT2(totalPrice)

            const flatGroup: FlatOrderLineGroup = {
                buyerParty: buyerParty as BuyerParty,
                paymentMethod: paymentMethod as PaymentMethodType,
                orderLines: ol.map(toDineroOrderLine),
                totalPrice,
                includedVAT,
            }
            bpGroups.push(flatGroup)
            return bpGroups
        }, allGroups)
    }, [] as FlatOrderLineGroup[])
}

export type Receipt = Readonly<{
    orderId: number
    orderUid: string
    orderType: string
}>

type ReceiptProps = Readonly<{
    receipt: Receipt
    open: boolean
    onClose: () => void
}>

export function ReceiptDialog({ receipt: { orderId, orderUid, orderType }, open, onClose }: ReceiptProps) {
    const [isForwardReceiptOpen, setForwardReceiptOpen] = useState(false)

    const dateTimeFactory = useDateTime()

    const orderResponse = useApiQuery(
        getOrderDetails,
        {
            queryName: "orderDetails",
            dependencies: { orderId },
        }
    )

    const groupedOrderLines = useMemo(
        () => flattenGroupedOrderLines(getGroupedOrderLines(orderResponse)),
        [orderResponse.isLoading]
    )

    return (
        <StandardDialog
            titleElement={(
                <LocalizedStrict id="receipt-title">
                    <StandardTopbarTitle>Kvittering</StandardTopbarTitle>
                </LocalizedStrict>
            )}
            open={open}
            onClose={onClose}
        >
            {!orderResponse.isError && (
                <ReceiptContainer>
                    <HeaderSection>{getOrderDisplayName(orderId, orderResponse)}</HeaderSection>

                    <PurchaseDetailsSection
                        paymentDetails={getPaymentDetails(orderResponse)}
                        kitchen={getKitchen(orderResponse)}
                        customer={getCustomer(orderResponse)}
                        timeOfPurchase={getTimeOfPurchase(orderResponse, dateTimeFactory)}
                        orderId={`${orderId}`}
                        shopChannel={getLoadedOrder(orderResponse)?.shopChannel}
                    />

                    {/*
                    <ActionsSection
                        orderId={orderId}
                        orderUid={getLoadedOrder(orderResponse)?.uid}
                        delivery={getDelivery(orderResponse)}
                    />
                    */}

                    <DeliveryDetailsSection
                        orderType={orderType}
                        delivery={getDelivery(orderResponse)}
                        deliveryComment={getDeliveryComment(orderResponse)}
                    />

                    {groupedOrderLines ? (
                        <>
                            {groupedOrderLines.map((group, index, array) => (

                                <OrderDetailsSection key={index} orderDetails={group} final={index === array.length - 1} />
                            ))}
                        </>
                    ) : (
                        <OrderDetailsSection final={true} />
                    )}
                </ReceiptContainer>
            )}

            {orderResponse.isError && (
                <ErrorView
                    lottieAnimation={GeneralErrorAnim}
                    title="A problem occurred"
                    message="Failed to load receipt"
                    buttonLabel="Close"
                    onClose={onClose}
                />
            )}

            <ForwardReceiptDrawer
                name="detailed-receipt-forward"
                orderUids={[orderUid]}
                open={isForwardReceiptOpen}
                onClose={() => setForwardReceiptOpen(false)}
            />
        </StandardDialog>
    )
}

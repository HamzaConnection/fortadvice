import { Dinero } from "@dinero.js/core"
import { StrictOmit } from "../../../lib/lang"
import { LocalizedEnum, LocalizedStrict } from "../../localization/components/AppLocalized"
import { useMoney } from "../../currency/useMoney"
import { PaymentMethodType } from "../../payments/paymentTypes"
import { BuyerParty, IOrderLine } from "../../payments/orderTypes"
import { ReceiptInfoItem, ReceiptOrderLine, ReceiptOrderTotal, ReceiptSection, ReceiptSkeleton } from "./ReceiptBlocks"

export type DineroOrderLine = StrictOmit<IOrderLine, "price"> & Readonly<{
    price?: Dinero<number>
}>

export type FlatOrderLineGroup = Readonly<{
    buyerParty: BuyerParty
    paymentMethod: PaymentMethodType
    orderLines: DineroOrderLine[]
    totalPrice: Dinero<number>
    includedVAT: Dinero<number>
}>

type OrderDetailsProps = Readonly<{
    orderDetails?: FlatOrderLineGroup
    final: boolean
}>

export function OrderDetailsSection({ orderDetails, final }: OrderDetailsProps) {
    const moneyFactory = useMoney({})

    if (orderDetails === undefined) {
        return (
            <ReceiptSection
                heading={<ReceiptSkeleton />}
                final={final}
            >
                <ReceiptOrderLine initial={true} />
                <ReceiptOrderTotal initial={true} />
            </ReceiptSection>
        )
    }

    return (
        <ReceiptSection
            heading={
                <LocalizedEnum base="receipt-order-details-buyerparty" enumValue={orderDetails.buyerParty}>
                    <span>{orderDetails.buyerParty}</span>
                </LocalizedEnum>
            }
            final={final}
        >
            <LocalizedStrict id="receipt-order-details-payment-method-item" attrs={{ label: true }}>
                <ReceiptInfoItem label="Betalingsmetode:">
                    <>
                        {/* l10n id: receipt-payment-method-credit-card etc */}
                        <LocalizedEnum base="receipt-payment-method" enumValue={orderDetails.paymentMethod}>
                            <span>{orderDetails.paymentMethod}</span>
                        </LocalizedEnum>
                    </>
                </ReceiptInfoItem>
            </LocalizedStrict>

            {orderDetails.orderLines.map((line, index) => (
                <ReceiptOrderLine key={index} orderLine={line} price={line.price ? moneyFactory.format(line.price) : undefined} initial={index === 0} />
            ))}

            <ReceiptOrderTotal totalPrice={moneyFactory.format(orderDetails.totalPrice)} initial={true} />
            <LocalizedStrict id="receipt-order-details-vat-total" attrs={{ label: true }}>
                <ReceiptOrderTotal label="Heraf moms" totalPrice={moneyFactory.format(orderDetails.includedVAT)} initial={false} />
            </LocalizedStrict>
        </ReceiptSection>
    )
}

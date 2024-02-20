import { DateTime } from "luxon"
import { Typography } from "@mui/material"
import { LocalizedEnum, LocalizedStrict } from "../../localization/components/AppLocalized"
import { useDateTime } from "../../localization/useDateTime"
import { PaymentMethodType } from "../../payments/paymentTypes"
import { ICanteen, IOrganizer, OrderPaymentDetails } from "../../payments/orderTypes"
import { ReceiptInfoItem, ReceiptSection, ReceiptSkeleton } from "./ReceiptBlocks"

function getStreetAddress(kitchen: ICanteen) {
    return `${kitchen.streetName} ${kitchen.streetNumber}`.trim()
}

function getPostalCity(kitchen: ICanteen) {
    return `${(kitchen.postalCode ?? "")} ${(kitchen.city ?? "")}`.trim()
}

function getCustomerPhoneNumber(customer: IOrganizer) {
    return customer.mobilePhone ? customer.mobilePhone : customer.businessPhone
}

export function getPaymentMethodType(paymentMethodType: PaymentMethodType) {
    return paymentMethodType === PaymentMethodType.SALARY_REDUCTION
        ? PaymentMethodType.PAYROLL_DEDUCTION
        : paymentMethodType
}

type PurchaseDetailsProps = Readonly<{
    paymentDetails: OrderPaymentDetails | undefined
    kitchen: ICanteen | undefined
    customer: IOrganizer | undefined
    timeOfPurchase: DateTime | undefined
    orderId: string
    shopChannel: string | undefined
}>

export function PurchaseDetailsSection({ paymentDetails, kitchen, customer, timeOfPurchase, orderId, shopChannel }: PurchaseDetailsProps) {
    const dateTimeFactory = useDateTime()
    const paymentStatusColor =
        paymentDetails?.status === "UNPAID" ||
            paymentDetails?.status === "REFUNDED" ||
            paymentDetails?.status === "CANCELLED"
            ? "error"
            : "textPrimary"

    const paymentStatusElement = (
        <>
            {/* l10n id: receipt-purchase-payment-status-paid etc */}
            {paymentDetails && paymentDetails.status ? (
                <LocalizedEnum base="receipt-purchase-payment-status" enumValue={paymentDetails.status}>
                    <Typography variant="h6" color={paymentStatusColor}>
                        {paymentDetails.status}
                    </Typography>
                </LocalizedEnum>
            ) : (
                <ReceiptSkeleton />
            )}
        </>
    )

    return (
        <LocalizedStrict id="receipt-purchase-details-section" attrs={{ heading: true }}>
            <ReceiptSection
                heading="Købsdetaljer"
                rightElement={paymentStatusElement}
                final={false}  // TODO: Flip to true when actions section is added back in
            >
                <LocalizedStrict id="receipt-purchase-address-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Købssted:">
                        {kitchen ? (
                            <>
                                {kitchen.name && <span>{kitchen.name}</span>}
                                {getStreetAddress(kitchen) && <span>{getStreetAddress(kitchen)}</span>}
                                {getPostalCity(kitchen) && <span>{getPostalCity(kitchen)}</span>}
                                {kitchen.vatnumber && (
                                    <LocalizedStrict id="receipt-purchase-seller-vat-number" vars={{ vatNumber: kitchen.vatnumber }}>
                                        <span>{`CVR: ${kitchen.vatnumber}`}</span>
                                    </LocalizedStrict>
                                )}
                            </>
                        ) : (
                            <ReceiptSkeleton />
                        )}
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-purchase-customer-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Kunde:">
                        {customer ? (
                            <>
                                {customer.name && <span>{customer.name}</span>}
                                {customer.email && <span>{customer.email}</span>}
                                {getCustomerPhoneNumber(customer) && <span>{getCustomerPhoneNumber(customer)}</span>}
                            </>
                        ) : (
                            <ReceiptSkeleton />
                        )}
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-purchase-time-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Købstid:">
                        {timeOfPurchase ? (<span>{dateTimeFactory.formatDateTime(timeOfPurchase)}</span>) : (<ReceiptSkeleton />)}
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-purchase-payment-method-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Betalingsmetode:">
                        {paymentDetails?.method ? (
                            <>
                                {/* l10n id: receipt-payment-method-credit-card etc */}
                                <LocalizedEnum base="receipt-payment-method" enumValue={paymentDetails.method}>
                                    <span>{getPaymentMethodType(paymentDetails.method)}</span>
                                </LocalizedEnum>
                                {paymentDetails.card && (
                                    <>
                                        {paymentDetails.card.type && <span>{paymentDetails.card.type}</span>}
                                        {paymentDetails.card.number && <span>{paymentDetails.card.number}</span>}
                                    </>
                                )}
                            </>
                        ) : (
                            <ReceiptSkeleton />
                        )}
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-purchase-order-id-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Ordre-id:">
                        <span>{orderId}</span>
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-purchase-shop-channel-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Via:">
                        {shopChannel ? (
                            <span>{shopChannel}</span>
                        ) : (
                            <ReceiptSkeleton />
                        )}
                    </ReceiptInfoItem>
                </LocalizedStrict>
            </ReceiptSection>
        </LocalizedStrict>
    )
}

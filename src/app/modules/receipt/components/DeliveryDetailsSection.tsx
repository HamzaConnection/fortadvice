import { LocalizedEnum, LocalizedStrict } from "../../localization/components/AppLocalized"
import { useDateTime } from "../../localization/useDateTime"
import { IOrderDelivery } from "../../payments/orderTypes"
import { Comment, ReceiptCommentItem, ReceiptInfoItem, ReceiptSection, ReceiptSkeleton } from "./ReceiptBlocks"

type DeliveryDetailsProps = Readonly<{
    orderType: string
    delivery: IOrderDelivery | undefined
    deliveryComment: Comment | undefined
}>

export function DeliveryDetailsSection({ orderType, delivery, deliveryComment }: DeliveryDetailsProps) {
    const dateTimeFactory = useDateTime()

    return (
        <LocalizedStrict id="receipt-delivery-details-section" attrs={{ heading: true }}>
            <ReceiptSection heading="Levering">
                <LocalizedStrict id="receipt-delivery-order-type-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Ordretype:">
                        {/* l10n id: receipt-order-type-lunch etc */}
                        <LocalizedEnum base="receipt-order-type" enumValue={orderType}>
                            <span>{orderType}</span>
                        </LocalizedEnum>
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-delivery-type-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Leveringstype:" hide={delivery && delivery.deliveryTime === undefined}>
                        {delivery?.deliveryType ? (
                            <>
                                {/* l10n id: receipt-delivery-type-pick-up etc */}
                                <LocalizedEnum base="receipt-delivery-type" enumValue={delivery.deliveryType}>
                                    <span>{delivery.deliveryType}</span>
                                </LocalizedEnum>
                            </>
                        ) : (
                            <ReceiptSkeleton />
                        )}
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-delivery-time-item" attrs={{ label: true }}>
                    <ReceiptInfoItem label="Leveringstidspunkt:" hide={delivery && delivery.deliveryTime === undefined}>
                        {delivery?.deliveryTime ? (
                            <span>
                                {dateTimeFactory.formatDateTime(dateTimeFactory.fromISO(delivery.deliveryTime))}
                            </span>
                        ) : (
                            <ReceiptSkeleton />
                        )}
                    </ReceiptInfoItem>
                </LocalizedStrict>

                <LocalizedStrict id="receipt-delivery-comment-item" attrs={{ label: true }}>
                    <ReceiptCommentItem label="Kommentar:" comment={deliveryComment} />
                </LocalizedStrict>
            </ReceiptSection>
        </LocalizedStrict>
    )
}

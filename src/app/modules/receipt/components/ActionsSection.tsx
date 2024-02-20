import { useState } from "react"
import { StrictOmit } from "../../../lib/lang"
import { MessageDialog } from "../../../shared/components/dialogs/MessageDialog"
import { ConfirmationDialog } from "../../../shared/components/dialogs/ConfirmationDialog"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { useApiMutation } from "../../../core/api/useApiMutation"
import { IOrderDelivery, IOrderDeliveryCancel } from "../../payments/orderTypes"
import { refundOrder } from "../ordersApi"
import { HeadlessReceiptSection, ReceiptAction, ReceiptSkeleton } from "./ReceiptBlocks"
import { ForwardReceiptDrawer } from "./ForwardReceiptDrawer"
// TODO: Use this animation when/if confirm dialog grows support for animations
import CancelOrderAnim from "../assets/cancel-order-lottie-anim.json"
import OrderLockedAnim from "../assets/order-locked-lottie-anim.json"

enum ActionDialog {
    None = "None",
    ForwardReceipt = "ForwardReceipt",
    ConfirmCancel = "ConfirmCancel",
    CancelUnavailable = "CancelUnavailable",
    CancelDisabled = "CancelDisabled",
}

type ConfirmCancelProps = Readonly<{
    loading: boolean
    open: boolean
    onClose: () => void
    onConfirm: () => void
}>

function ConfirmCancelModal({ loading, open, onClose, onConfirm }: ConfirmCancelProps) {
    return (
        <LocalizedStrict id="receipt-actions-confirm-cancel-dialog" attrs={{ description: true, confirmLabel: true, cancelLabel: true, loadingDescription: true }}>
            <ConfirmationDialog
                description="Er du sikker på, at du vil annullere din bestilling?"
                confirmLabel="Ja"
                cancelLabel="Nej"
                loading={loading}
                loadingDescription="Annullerer bestilling..."
                open={open}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        </LocalizedStrict>
    )
}

type CancelUnavailableProps = Readonly<{
    cancelDetails: IOrderDeliveryCancel
    open: boolean
    onClose: () => void
}>

function CancelUnavailableModal({ cancelDetails, open, onClose }: CancelUnavailableProps) {
    return (
        <LocalizedStrict id="receipt-actions-cancel-unavailable-dialog" attrs={{ buttonLabel: true }}>
            <MessageDialog
                name="cancel-unavailable-modal"
                title={cancelDetails.shortMessage}
                message={cancelDetails.message}
                buttonLabel="Forstået"
                lottieAnim={OrderLockedAnim}
                open={open}
                onClose={onClose}
            />
        </LocalizedStrict>
    )
}

function CancelDisabledModal({ open, onClose }: StrictOmit<CancelUnavailableProps, "cancelDetails">) {
    return (
        <LocalizedStrict id="receipt-actions-cancel-disabled-dialog" attrs={{ title: true, message: true, buttonLabel: true }}>
            <MessageDialog
                name="cancel-unavailable-modal"
                title="Refundering slået fra"
                message="Kan ikke refundere ordre endnu. Funktionen kommer senere."
                buttonLabel="Forstået"
                lottieAnim={OrderLockedAnim}
                open={open}
                onClose={onClose}
            />
        </LocalizedStrict>
    )
}

type ActionsSectionProps = Readonly<{
    orderId: number
    orderUid: string | undefined
    delivery: IOrderDelivery | undefined
}>

export function ActionsSection({ orderId, orderUid, delivery }: ActionsSectionProps) {
    const [openDialog, setOpenDialog] = useState(ActionDialog.None)

    const { isLoading: deleting, mutateAsync: callDeleteOrder } = useApiMutation(refundOrder, {
        onSuccess: (async (_params, data, context) => {
            context.queryClient.invalidateQueries({ queryKey: ["purchases-by-period"] })

            // TODO: Need to implement proper transaction handling w/ poller
            //handleTransactionResponse(data)
        })
    })

    function handleCancelOrder() {
        setOpenDialog(ActionDialog.CancelDisabled)
        return

        if (delivery?.cancelOrder?.cancelEnable ?? false) {
            setOpenDialog(ActionDialog.ConfirmCancel)
        } else {
            setOpenDialog(ActionDialog.CancelUnavailable)
        }
    }
    function handleConfirmedCancelOrder() {
        setOpenDialog(ActionDialog.None)

        callDeleteOrder({ orderId })
    }

    return (
        <>
            <HeadlessReceiptSection>
                {orderUid ? (
                    <LocalizedStrict id="receipt-actions-forward-receipt-button">
                        <ReceiptAction onClick={() => setOpenDialog(ActionDialog.ForwardReceipt)}>
                            Send kvittering
                        </ReceiptAction>
                    </LocalizedStrict>
                ) : (
                    <ReceiptSkeleton />
                )}
                {delivery ?
                    delivery?.cancelOrder && (
                        <LocalizedStrict id="receipt-actions-cancel-order-button">
                            <ReceiptAction onClick={handleCancelOrder}>
                                Annuller bestilling
                            </ReceiptAction>
                        </LocalizedStrict>
                    ) : (
                        <ReceiptSkeleton />
                    )
                }
            </HeadlessReceiptSection>
            {orderUid && (
                <ForwardReceiptDrawer
                    name="detailed-receipt-forward"
                    orderUids={[orderUid]}
                    open={openDialog === ActionDialog.ForwardReceipt}
                    onClose={() => setOpenDialog(ActionDialog.None)}
                />
            )}
            {delivery?.cancelOrder && (
                <ConfirmCancelModal
                    loading={deleting}
                    open={openDialog === ActionDialog.ConfirmCancel}
                    onClose={() => setOpenDialog(ActionDialog.None)}
                    onConfirm={handleConfirmedCancelOrder}
                />
            )}
            {delivery?.cancelOrder && (
                <CancelUnavailableModal
                    cancelDetails={delivery.cancelOrder}
                    open={openDialog === ActionDialog.CancelUnavailable}
                    onClose={() => setOpenDialog(ActionDialog.None)}
                />
            )}
            {delivery?.cancelOrder && (
                <CancelDisabledModal
                    open={openDialog === ActionDialog.CancelDisabled}
                    onClose={() => setOpenDialog(ActionDialog.None)}
                />
            )}
        </>
    )
}

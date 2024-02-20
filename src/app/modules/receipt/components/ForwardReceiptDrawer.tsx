
import { Formik, useFormikContext } from "formik"
import * as yup from "yup"
import { useSnackbar } from "notistack"
import { Logger } from "../../../lib/logging"
import { FormikDrawer } from "../../../shared/components/drawers/FormDrawer"
import { LoadingDialog } from "../../../shared/components/dialogs/LoadingDialog"
import { FormikTextField } from "../../../shared/components/forms/Formik"
import { usePublicApiMutation } from "../../../core/api/useApiMutation"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { forwardReceiptByEmail } from "../ordersApi"
import SendEmailLottieAnim from "../assets/send-email.json"
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider'

function SendingEmailLoadingDialog() {
    const { isSubmitting } = useFormikContext()

    return (
        <LoadingDialog
            loading={isSubmitting}
            lottieAnim={SendEmailLottieAnim}
            lottieSpeed={1.5}
            lottieStartFrame={125}
            lottieStopFrame={225}
        />
    )
}

type FormValues = Readonly<{
    forwardToEmail: string
}>

type ForwardReceiptDrawerProps = Readonly<{
    orderUids: string[]
    name: string
    open: boolean
    onClose: () => void
}>

const logger = new Logger("receipt")

export function ForwardReceiptDrawer({ name, orderUids, open, onClose }: ForwardReceiptDrawerProps) {
    const { l10n } = useAppLocalization()
    const { enqueueSnackbar } = useSnackbar()

    const { mutateAsync: callForwardReceipt } = usePublicApiMutation(forwardReceiptByEmail, {})

    // TODO: Take email from user object once it is available there
    const defaultEmail = ""

    function handleCallError(e: unknown) {
        let message = "Unknown error"
        if (typeof e === "string") message = e
        if (e instanceof Error) message = e.message

        enqueueSnackbar({
            variant: "error",
            message: `An error occurred: ${message}`
        })
    }

    return (
        <Formik<FormValues>
            initialValues={{
                forwardToEmail: defaultEmail,
            }}
            validationSchema={yup.object().shape({
                forwardToEmail: yup
                    .string()
                    .required(l10n.getString("receipt-forward-receipt-email-field-is-required"))
                    .email(l10n.getString("receipt-forward-receipt-email-field-must-be-valid")),
            })}
            onSubmit={(value) => {
                if (orderUids.length === 0) return Promise.resolve()
                return callForwardReceipt({ recipientEmail: value.forwardToEmail, orderUids })
                    .catch(e => handleCallError(e))
            }}
        >
            <LocalizedStrict
                id="receipt-forward-receipt-dialog"
                vars={{ receipts: orderUids.length }}
                attrs={{ title: true, cancelButtonLabel: true, submitButtonLabel: true, submitButtonLoadingLabel: true }}
            >
                <FormikDrawer
                    name={name}
                    open={open}
                    onClose={onClose}
                    title="Send kvittering"
                    cancelButtonLabel="Annuller"
                    submitButtonLabel="Send"
                    submitButtonLoadingLabel="Sender..."
                    loadingDialog={(<SendingEmailLoadingDialog />)}
                >
                    <LocalizedStrict id="receipt-forward-receipt-email-field" attrs={{ label: true }}>
                        <FormikTextField<FormValues>
                            id="forwardToEmail"
                            name="forwardToEmail"
                            label="Email adresse"
                            inputMode="email"
                            autoFocus
                            autoComplete="email"
                            fullWidth
                        />
                    </LocalizedStrict>
                </FormikDrawer>
            </LocalizedStrict>
        </Formik>
    )
}

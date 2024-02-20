import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material'
import { LoadingDialog } from './LoadingDialog'
import { StandardButton } from '../buttons/StandardButton'
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider'

interface IProps {
    description: string
    confirmLabel: string
    cancelLabel?: string
    open: boolean
    loading?: boolean
    loadingDescription?: string
    onClose: () => void
    onConfirm: () => void
}

export function ConfirmationDialog(props: IProps) {
    const { loading, loadingDescription } = props
    const { l10n } = useAppLocalization()

    if (loading && loadingDescription) {
        return (<LoadingDialog loading={loading} description={loadingDescription} />)
    }

    const cancelLabel = props.cancelLabel ?? l10n.getString("confirmation-dialog-cancel")

    return (
        <Dialog
            open={props.open}
            onClose={props.onClose}
        >
            <DialogTitle>
                {props.description}
            </DialogTitle>
            <DialogActions>
                <StandardButton onClick={props.onClose} variant="text">
                    {cancelLabel}
                </StandardButton>
                <Button onClick={props.onConfirm} color="secondary" variant="text">
                    {props.confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

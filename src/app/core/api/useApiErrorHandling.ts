import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import { AppError, ErrorDisplay } from './errorTypes'
import { useCallback } from 'react'
import { UnreachableCaseError } from '../../lib/lang'
import { useAppLocalization } from '../../modules/localization/components/AppLocalizationProvider'

export function useApiErrorHandling() {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { l10n } = useAppLocalization()

    const handleError = useCallback((error: unknown, errorDisplay: ErrorDisplay) => {
        let appError: AppError
        if (error instanceof AppError) {
            appError = error
        } else {
            const cause = error instanceof Error ? error : undefined
            const title = l10n.getString("api-call-error-title-unknown-error")
            const message = l10n.getString("api-call-error-unknown-error")
            appError = new AppError(title, message, cause)
        }

        switch (errorDisplay) {
            case ErrorDisplay.ROUTE:
            // TODO HAMZA: Create error route
            //navigate("/error", {
            //    state: appError
            //})
            case ErrorDisplay.DIALOG:
            // TODO: Show error dialog
            case ErrorDisplay.SNACKBAR:
                enqueueSnackbar({
                    variant: "error",
                    message: appError.displayMessage,
                })
                break
            case ErrorDisplay.NONE:
                // Ignore this error
                break
            default:
                throw new UnreachableCaseError(errorDisplay)
        }
    }, [])

    return { handleError }
}

import { AxiosError } from "axios"
import { useCallback } from "react"
import { Logger } from '../../lib/logging'
import { isObjectWithProp } from '../../lib/lang'
import { useAppLocalization } from '../../modules/localization/components/AppLocalizationProvider'



export function useApiErrors() {
    const { l10n, } = useAppLocalization()
    const logger = new Logger("api")


    const getAxiosErrorTitle = useCallback((error: AxiosError) => {
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    return l10n.getString("api-call-error-title-bad-request")
                case 401:
                    return l10n.getString("api-call-error-title-unauthorized")
                case 403:
                    return l10n.getString("api-call-error-title-forbidden")
                case 404:
                    return l10n.getString("api-call-error-title-not-found")
                case 409:
                    return l10n.getString("api-call-error-title-conflict")
                case 429:
                    return l10n.getString("api-call-error-title-too-many-requests")
                case 500:
                    return l10n.getString("api-call-error-title-internal-server-error")
                case 503:
                    return l10n.getString("api-call-error-title-service-unavailable")
                default:
                    return l10n.getString("api-call-error-title-request-failed")
            }
        } else {
            return l10n.getString("api-call-error-title-network-error")
        }
    }, [l10n])



    const getAxiosErrorMessage = useCallback((error: AxiosError) => {
        const url = (isObjectWithProp(error.request, "responseURL") && typeof error.request.responseURL === "string") ? error.request.responseURL : "<UNKNOWN>"

        if (error.response && error.response.data) {
            if (
                isObjectWithProp(error.response.data, "displayMessage") &&
                typeof error.response.data.displayMessage === "string"
            ) {
                logger.error(`Received error from API:`, error.response.data)
                return error.response.data.displayMessage
            } else {
                logger.error(`Received protocol error ${error.response.status} ${error.response.statusText} for URL '${url}':`, error.response.data)
                return l10n.getString("api-call-error-protocol-error", { responseCode: error.response.status, responseStatus: error.response.statusText })
            }
        } else {
            logger.error(`Received network error ${error.code} for URL '${url}':`, error.cause)
            return l10n.getString("api-call-error-could-not-reach-server")
        }
    }, [l10n])

    return { getAxiosErrorTitle, getAxiosErrorMessage }
}



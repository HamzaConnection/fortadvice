import axios from "axios"
import { useCallback, useMemo } from "react"
import { Logger } from "../../lib/logging"
import { useEnvironment } from "../../modules/environment/envHooks"
import { useAppSelector } from "../../modules/store/storeHooks"
import { selectSelectedLocale } from "../../modules/localization/localizationSelectors"
import { useAppLocalization } from '../../modules/localization/components/AppLocalizationProvider'
import { ApiError } from './errorTypes'
import { useApiErrors } from './useApiErrors'
import { selectAuthToken } from "../../modules/login/loginSelectors"

type AxiosCreateOptions = Readonly<{
    baseURL: string
    locale: string
    authToken: string | undefined
    timeoutInMillis?: number
    errorHandler?: (error: unknown) => void
    accept?: string
}>

const CLIENT_TYPE = "gopay-manager"
const DEFAULT_TIMEOUT_MILLIS = 25000

export function createAxiosInstance(options: AxiosCreateOptions) {
    const {
        baseURL,
        locale,
        authToken,
        timeoutInMillis = DEFAULT_TIMEOUT_MILLIS,
        errorHandler,
        accept
    } = options

    const axiosInstance = axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Client-Type": CLIENT_TYPE,
        },
        timeout: timeoutInMillis,
    })

    axiosInstance.interceptors.request.use((config) => {
        if (config.headers) {
            config.headers["Accept-Language"] = locale
            if (accept) config.headers["Accept"] = accept
            if (authToken) config.headers["X-Api-Key"] = authToken
        }

        return config
    })

    if (errorHandler) {
        axiosInstance.interceptors.response.use((response) => response, errorHandler)
    }

    return axiosInstance
}

type AxiosOptions = Readonly<{
    baseURL?: string
    authenticated?: boolean
    performErrorHandling?: boolean
    timeoutInMillis?: number
    accept?: string
}>

export function useAxios(options: AxiosOptions) {
    const {
        baseURL: baseUrlOverride,
        authenticated = true,
        performErrorHandling = true,
        timeoutInMillis = DEFAULT_TIMEOUT_MILLIS,
        accept

    } = options

    const logger = new Logger("api")

    const locale = useAppSelector(selectSelectedLocale)
    const authToken = useAppSelector(selectAuthToken)

    const { currentEnv } = useEnvironment()
    const { l10n } = useAppLocalization()
    const { getAxiosErrorTitle, getAxiosErrorMessage } = useApiErrors()

    //TODO fix interceptor so it responds to timeout errors
    const errorHandler = useCallback((error: unknown) => {
        if (axios.isAxiosError(error)) {
            const title = getAxiosErrorTitle(error)
            const message = getAxiosErrorMessage(error)

            throw new ApiError(
                title,
                message,
                error.response?.status,
                error.response?.statusText,
                error.cause
            )
        }

        // Response will not be available in case of network errors etc
        const cause = (error instanceof Error) ? error : undefined

        throw new ApiError(
            l10n.getString("api-call-error-title-network-error"),
            l10n.getString("api-call-error-unknown-error"),
            undefined,
            undefined,
            cause
        )
    }, [axios, getAxiosErrorTitle, getAxiosErrorMessage, l10n])

    const baseURL = baseUrlOverride ?? currentEnv.api.baseUrl

    logger.info(`Using API endpoint: ${baseURL} [default: ${currentEnv.api.baseUrl}, override: ${baseUrlOverride}]`)

    const axiosInstance = useMemo(() => {
        return createAxiosInstance({
            baseURL,
            locale,
            authToken: authenticated ? authToken : undefined,
            timeoutInMillis,
            errorHandler: performErrorHandling ? errorHandler : undefined,
            accept,
        })
    }, [baseURL, locale, authenticated, authToken, timeoutInMillis, performErrorHandling, errorHandler, accept])

    return axiosInstance
}

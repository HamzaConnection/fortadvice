import { AxiosInstance } from "axios"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { StrictOmit } from "../../lib/lang"
import { ErrorDisplay } from "./errorTypes"
import { useAxios } from "./useAxios"
import { useApiErrorHandling } from "./useApiErrorHandling"

export function queryKeyFor<TParams extends object>(queryName: string, params: TParams) {
    return [queryName, params]
}

type ApiQueryOptions<TParams extends object, TResponse, TSelect = TResponse> = Readonly<{
    queryName: string
    dependencies: TParams
    enabled?: boolean
    authenticated?: boolean
    errorDisplay?: ErrorDisplay
    baseURL?: string
    suspense?: boolean
    useErrorBoundary?: boolean
    accept?: string
    select?: (data: TResponse) => TSelect
}>

// Typescript is smart to know what TParams and TResponse is since for instance fetchPurchasesByPeriod both has a FetchPurchasesParams and FetchPurchasesResponse
// apiCall is the actual call so it's fetchPurchasesByPeriod function body
export function useApiQuery<TParams extends object, TResponse, TSelect = TResponse>(
    apiCall: (params: TParams, axios: AxiosInstance, signal?: AbortSignal) => Promise<TResponse>,
    options: ApiQueryOptions<TParams, TResponse, TSelect>,
): UseQueryResult<TSelect> {
    const {
        queryName,
        dependencies,
        enabled = true,
        authenticated = true,
        errorDisplay = ErrorDisplay.SNACKBAR,
        baseURL,
        suspense,
        useErrorBoundary,
        accept,
        select,
    } = options

    const axios = useAxios({ baseURL, authenticated, accept })
    const { handleError } = useApiErrorHandling()

    const result = useQuery({
        queryKey: queryKeyFor(queryName, dependencies),
        queryFn: async ({ queryKey, pageParam, signal, meta }) => {
            return await apiCall(dependencies, axios, signal)
        },
        enabled,
        retry: false,
        refetchOnWindowFocus: false,
        suspense,
        useErrorBoundary,
        select,
    })

    if (result.isError) {
        const error = result.error
        handleError(error, errorDisplay)
    }

    return result
}

type PublicApiQueryOptions<TParams extends object, TResponse, TSelect = TResponse> = StrictOmit<
    ApiQueryOptions<TParams, TResponse, TSelect>,
    "authenticated"
>

export function usePublicApiQuery<TParams extends object, TResponse, TSelect = TResponse>(
    apiCall: (params: TParams, axios: AxiosInstance, signal?: AbortSignal) => Promise<TResponse>,
    options: PublicApiQueryOptions<TParams, TResponse, TSelect>,
): UseQueryResult<TSelect> {
    return useApiQuery(apiCall, { ...options, authenticated: false })
}

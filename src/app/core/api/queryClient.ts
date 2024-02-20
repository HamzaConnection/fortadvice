import { QueryClient } from "@tanstack/react-query";
import { store } from "../../modules/store/store"
import { LoginStatus } from "../../modules/login/loginTypes";
import { selectAuthToken } from "../../modules/login/loginSelectors";
import { AxiosInstance } from "axios";
import { selectSelectedLocale } from "../../modules/localization/localizationSelectors";
import { createAxiosInstance } from "./useAxios";
import { createEnvironment } from "../../modules/environment/environment";
import { StrictOmit } from "../../lib/lang";

const DEFAULT_STALE_TIME = 10*1000  // 10 seconds

// Creates a shared query client for the app that enables caching
// NOTE: We cannot use a hook since it needs to be accessible in non-hook context,
// ie. React Router loaders
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: DEFAULT_STALE_TIME
        }
    }
})

function getStateFromStore() {
    const state = store.getState()
    const authToken = selectAuthToken(state)
    const locale = selectSelectedLocale(state)
    return { authToken, locale }
}

type PrefetchQueryOptions<TParams extends object> = Readonly<{
    queryName: string
    dependencies: TParams
    authenticated?: boolean
}>

export async function prefetchQuery<TParams extends object, TResponse>(
    apiCall: (params: TParams, axios: AxiosInstance, signal?: AbortSignal) => Promise<TResponse>,
    options: PrefetchQueryOptions<TParams>
) {
    const { queryName, dependencies, authenticated = true } = options
    const { authToken, locale } = getStateFromStore()
    const env = createEnvironment()

    const axios = createAxiosInstance({
        baseURL: env.api.baseUrl,
        locale,
        authToken: authenticated ? authToken : undefined,
    })

    await queryClient.prefetchQuery({
        queryKey: [queryName, dependencies],
        queryFn: async ({ signal }) => await apiCall(dependencies, axios, signal),
        retry: false,
    })

    return null
}

export async function prefetchPublicQuery<TParams extends object, TResponse>(
    apiCall: (params: TParams, axios: AxiosInstance, signal?: AbortSignal) => Promise<TResponse>,
    options: StrictOmit<PrefetchQueryOptions<TParams>, "authenticated">
) {
    return await prefetchQuery(apiCall, { ...options, authenticated: false })
}

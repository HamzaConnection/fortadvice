import { AxiosInstance } from "axios"
import { useCallback } from "react"
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query"
import { StrictOmit } from "../../lib/lang"
import { ErrorDisplay } from './errorTypes'
import { useAxios } from "./useAxios"
import { useApiErrorHandling } from './useApiErrorHandling'

interface BaseContext {
    readonly queryClient: QueryClient
}

type ApiCall<TParams extends object, TResponse> = (params: TParams, axios: AxiosInstance) => Promise<TResponse>
type OnMutate<TParams extends object, TContext extends object> = (params: TParams) => Promise<TContext | undefined>
type OnSuccess<TParams extends object, TResponse, TContext extends object> = (params: TParams, data: TResponse, context: (TContext & BaseContext) | BaseContext) => Promise<unknown>
type OnError<TParams extends object, TError, TContext extends object> = (params: TParams, error: TError, context: (TContext & BaseContext) | BaseContext) => Promise<unknown>

type ApiMutationOptions<TParams extends object, TResponse, TError, TContext extends object> = Readonly<{
    onMutate?: OnMutate<TParams, TContext>
    onSuccess?: OnSuccess<TParams, TResponse, TContext>
    onError?: OnError<TParams, TError, TContext>
    authenticated?: boolean
    errorDisplay?: ErrorDisplay
    accept?: string
    baseURL?: string

}>

export function useApiMutation<TParams extends object, TResponse, TError = unknown, TContext extends object = {}>(apiCall: ApiCall<TParams, TResponse>, options: ApiMutationOptions<TParams, TResponse, TError, TContext>) {
    // TODO: Default error display should not be snackbar
    const { onMutate, onSuccess, onError, authenticated = true, errorDisplay = ErrorDisplay.SNACKBAR, accept, baseURL } = options

    const queryClient = useQueryClient()
    const axios = useAxios({ authenticated, accept, baseURL })
    const { handleError } = useApiErrorHandling()

    const mutationFn = useCallback(async (params: TParams) => await apiCall(params, axios), [axios])

    const onMutateFn = useCallback(async (params: TParams) => {
        // TODO: Do we need error handling here? Test how Tanstack handles errors from onMutate!
        return await onMutate?.(params)
    }, [onMutate])

    const onSuccessFn = useCallback(async (data: TResponse, params: TParams, context: TContext | undefined) => {
        try {
            return await onSuccess?.(params, data, { queryClient, ...(context ?? {}) })
        } catch (err) {
            handleError(err, errorDisplay)
        }
        return undefined
    }, [onSuccess, queryClient])

    const onErrorFn = useCallback(async (error: TError, params: TParams, context: TContext | undefined) => {
        if (onError) {
            try {
                return await onError(params, error, { queryClient, ...(context ?? {}) })
            } catch (err: unknown) {
                handleError(err, errorDisplay)
            }
        } else {
            handleError(error, errorDisplay)
        }
        return undefined
    }, [onError, queryClient])

    return useMutation<TResponse, TError, TParams, TContext>({
        mutationFn,
        onMutate: onMutateFn,
        onSuccess: onSuccessFn,
        onError: onErrorFn,
        retry: false,

    })
}

type PublicApiMutationOptions<TParams extends object, TResponse, TError, TContext extends object> = StrictOmit<ApiMutationOptions<TParams, TResponse, TError, TContext>, "authenticated">

export function usePublicApiMutation<TParams extends object, TResponse, TError = unknown, TContext extends object = {}>(apiCall: ApiCall<TParams, TResponse>, options: PublicApiMutationOptions<TParams, TResponse, TError, TContext>) {
    return useApiMutation(apiCall, { ...options, authenticated: false, })
}

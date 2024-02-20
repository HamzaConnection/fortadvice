import { type PropsWithChildren, useEffect, useState, useCallback, useMemo } from "react"
import { UseQueryResult } from "@tanstack/react-query"
import { NoDataError } from "../errorTypes"

function usePromise<T>() {
    const [result, setResult] = useState<T>()
    const [error, setError] = useState<unknown>()

    const promise = useMemo(() => new Promise((resolve, reject) => {
        if (result) resolve(result)
        if (error) reject(error)
    }), [result, error])

    return {
        promise,
        setPromiseResult: setResult,
        setPromiseError: setError,
    }
}

export type SuspenseAdapterProps<T> = Readonly<
    PropsWithChildren<{
        data: T | undefined
        error: unknown
        isLoading: boolean
        selector?: (data: T) => unknown
    }>
>

export function SuspenseAdapter<T>({ data, error, isLoading, selector, children }: SuspenseAdapterProps<T>) {
    const { promise, setPromiseResult, setPromiseError } = usePromise()

    useEffect(() => {
        if (data) {
            setPromiseResult(data)
        }
        if (error) {
            setPromiseError(error)
        }
    }, [data, error])

    if (isLoading) {
        throw promise
    }

    if (error) {
        throw error
    }

    if (data && selector) {
        if (!selector(data)) throw new NoDataError()
    }

    return <>{children}</>
}

type UseSuspenseParams<T> = Readonly<{
    queryResult: UseQueryResult<T>
    indicator: "loading" | "fetching"
    selector: SuspenseAdapterProps<T>["selector"]
}>

export function useSuspense<T>({ queryResult, selector }: UseSuspenseParams<T>) {
    const suspenseAdapter = useCallback(
        ({ children }: Pick<SuspenseAdapterProps<T>, "children">) => (
            <SuspenseAdapter<T> data={queryResult.data} error={queryResult.error} isLoading={queryResult.isInitialLoading} selector={selector}>
                {children}
            </SuspenseAdapter>
        ),
        [queryResult.data, queryResult.error, queryResult.isInitialLoading, selector],
    )

    return {
        SuspenseAdapter: suspenseAdapter
    }
}

export type SuspenseAdapterProp = ReturnType<typeof useSuspense>["SuspenseAdapter"]

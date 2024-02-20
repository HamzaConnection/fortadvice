import { type TableContainerProps } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { type MRT_TableState } from "material-react-table"
import { type StrictOmit } from "../../../lib/lang"
import { useAppLocalization } from "../../../modules/localization/components/AppLocalizationProvider"
import { type LocMrtProps, LocalizedMaterialReactTable } from "../../../modules/localization/components/LocalizedMaterialReactTable"
import { UseQueryResult } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"

const useStyles = makeStyles()((_theme) => ({
    tableContainer: {
        maxHeight: "100%",
    },
}))

export type ApiQueryTableProps<TData extends Record<string, any>> = StrictOmit<LocMrtProps<TData>, "muiTableContainerProps" | "muiToolbarAlertBannerProps" | "state"> & Readonly<{
    isLoading: boolean
    isFetching: boolean
    isError: boolean
    state?: StrictOmit<Partial<MRT_TableState<TData>>, "isLoading" | "showAlertBanner" | "showProgressBars">
    muiTableContainerProps?: TableContainerProps
}>

export function ApiQueryTable<TData extends Record<string, any> = {}>({ isLoading, isFetching, isError, state, muiTableContainerProps, ...rest }: ApiQueryTableProps<TData>) {
    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()

    return (
        <LocalizedMaterialReactTable
            muiTableContainerProps={{
                ...muiTableContainerProps,
                className: cx(classes.tableContainer, muiTableContainerProps?.className),
            }}
            muiToolbarAlertBannerProps={
                isError ? {
                    color: "error",
                    children: l10n.getString("api-query-table-fetch-error-message"),
                } : undefined
            }
            state={{
                isLoading: isLoading,
                showProgressBars: isFetching,
                showAlertBanner: isError,
                ...state,
            }}
            {...rest}
        />
    )
}

type RemainingProps<TData extends Record<string, any>> = StrictOmit<ApiQueryTableProps<TData>, "isLoading" | "isFetching" | "isError" | "data">

export function useApiQueryTable<TData extends Record<string, any>>(queryResult: UseQueryResult<TData[]>) {
    const rowData = useMemo(() => queryResult.data ?? [], [queryResult.data])

    const apiQueryTable = useCallback((props: RemainingProps<TData>) => (
        <ApiQueryTable
            isLoading={queryResult.isInitialLoading}
            isFetching={queryResult.isFetching}
            isError={queryResult.isError}
            data={rowData}
            {...props}
        />
    ), [queryResult.isInitialLoading, queryResult.isFetching, queryResult.isError])

    return {
        ApiQueryTable: apiQueryTable
    }
}

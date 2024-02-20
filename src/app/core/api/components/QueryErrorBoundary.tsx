import { ReactNode, type ComponentType, type PropsWithChildren, useCallback, useEffect, useState } from "react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { Grid, GridProps, Typography, TypographyProps } from "@mui/material"
//import { faUserRobotXmarks } from "@fortawesome/pro-light-svg-icons"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { makeStyles } from "tss-react/mui"
import { LocalizedStrict } from "../../../modules/localization/components/AppLocalized"
import { NoDataError } from "../errorTypes"
import { StrictOmit } from "../../../lib/lang"
import { hashQueryKey } from "@tanstack/react-query"

const useStyles = makeStyles()((_theme) => ({
    contentWrapper: {
        width: "100%",
        height: "100%",
        padding: "10%",
        textAlign: "center",
    },
}))

type FallbackMessageProps = Readonly<PropsWithChildren<{
    slotProps?: {
        contentWrapper?: GridProps
        text?: TypographyProps
    }
}>>

export function QueryFallbackMessage({ slotProps = {}, children }: FallbackMessageProps) {
    const { contentWrapper: contentWrapperProps = {}, text: textProps = {} } = slotProps
    const { classes, cx } = useStyles()

    return (
        <Grid
            container
            direction="column"
            wrap="nowrap"
            justifyContent="center"
            alignItems="center"
            {...contentWrapperProps}
            className={cx(classes.contentWrapper, contentWrapperProps.className)}
        >
            <Typography
                variant="h6"
                fontStyle="italic"
                color="text.secondary"
                align="center"
                {...textProps}
            >
                {children}
            </Typography>
        </Grid>
    )
}

export type QueryErrorFallbackProps = StrictOmit<FallbackMessageProps, "children"> & FallbackProps

export function QueryErrorFallback({ error, resetErrorBoundary, ...rest }: QueryErrorFallbackProps) {
    return (
        <LocalizedStrict id="query-error-boundary-message">
            <QueryFallbackMessage {...rest}>
                Could not fetch data
            </QueryFallbackMessage>
        </LocalizedStrict>
    )
}

export function NoDataFallback(props: StrictOmit<FallbackMessageProps, "children">) {
    return (
        <LocalizedStrict id="query-error-boundary-no-data-message">
            <QueryFallbackMessage {...props}>
                No data
            </QueryFallbackMessage>
        </LocalizedStrict>
    )
}

type WrapperProps = FallbackProps &
    Readonly<
        PropsWithChildren<{
            noDataFallback: ReactNode
            dependencies?: object
        }>
    >

function FallbackWrapper({ error, noDataFallback, dependencies, children, resetErrorBoundary }: WrapperProps) {
    const [dependencyHash, setDependencyHash] = useState<string>()
    const nextHash = hashQueryKey([dependencies])

    useEffect(() => {
        setDependencyHash((prevHash) => {
            if (prevHash && nextHash !== prevHash) {
                // Reset error boundary when dependencies change
                if (error) resetErrorBoundary()
            }

            return nextHash
        })
    }, [nextHash, error, setDependencyHash, resetErrorBoundary])

    if (error instanceof NoDataError) {
        return <>{noDataFallback}</>
    }

    return <>{children}</>
}

type QueryErrorBoundaryProps = StrictOmit<FallbackMessageProps, "children"> & Readonly<
    PropsWithChildren<{
        Fallback?: ComponentType<FallbackProps>
        noDataFallback?: ReactNode
        dependencies?: object
    }>
>

export function QueryErrorBoundary({ Fallback, noDataFallback, dependencies, children, ...messageProps }: QueryErrorBoundaryProps) {
    const noDataFallbackToUse = noDataFallback ?? <NoDataFallback />

    function renderFallback(props: FallbackProps): ReactNode {
        return (
            <FallbackWrapper
                dependencies={dependencies}
                noDataFallback={noDataFallbackToUse}
                {...props}
            >
                {Fallback ? <Fallback {...props} /> : <QueryErrorFallback {...props} {...messageProps} />}
            </FallbackWrapper>
        )
    }

    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary fallbackRender={renderFallback} onReset={reset}>
                    {children}
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    )
}

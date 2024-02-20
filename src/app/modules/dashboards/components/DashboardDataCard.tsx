import { type ReactNode, Suspense, PropsWithChildren } from "react"
import { Box, CircularProgress, Grid, GridProps } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { type StrictOmit } from "../../../lib/lang"
import { QueryErrorBoundary } from "../../../core/api/components/QueryErrorBoundary"
import { DashboardCard, type DashboardCardProps } from "./DashboardCard"
import { childrenByElementType } from "../../../lib/reactLib"

const useStyles = makeStyles()((_theme) => ({
    spacer: {
        height: "2rem",
    },
    contentWrapper: {
        height: "100%",
    },
    graphWrapper: {
        position: "relative",
        height: "10rem",
    },
}))

type LegendProps = Readonly<PropsWithChildren<{}>>

export function DashboardDataLegend({ children }: LegendProps) {
    return (
        <>
            {children}
        </>
    )
}

type ContentProps = Readonly<PropsWithChildren<{}>>

export function DashboardDataContents({ children }: ContentProps) {
    return (
        <>
            {children}
        </>
    )
}

type CardProps = StrictOmit<DashboardCardProps, "slotProps"> & Readonly<{
    legend?: ReactNode
    dependencies?: object
    slotProps?: DashboardCardProps["slotProps"] & Readonly<{
        spacer?: {
            className?: string
        }
        contentWrapper?: GridProps,
        graphWrapper?: {
            className?: string
        }
    }>
}>

export function DashboardDataCard({ legend, dependencies, slotProps = {}, children, ...rest }: CardProps) {
    const { spacer: spacerProps = {}, contentWrapper: contentWrapperProps = {}, graphWrapper: graphWrapperProps = {}, ...otherSlotProps } = slotProps
    const { classes, cx } = useStyles()

    const childGroups = childrenByElementType(children, [])
    const justifyContent = childGroups.has(DashboardDataLegend) ? "space-between" : "center"

    // NOTE: Fragile layout ahead! ChartJS graphs are finicky to size, touch at your own risk
    return (
        <DashboardCard slotProps={otherSlotProps} {...rest}>
            <QueryErrorBoundary dependencies={dependencies}>
                <Box className={cx(classes.spacer, spacerProps.className)}></Box>
                <Suspense fallback={<CircularProgress size="10rem" />}>
                    <Grid
                        container
                        direction="column"
                        wrap="nowrap"
                        justifyContent={justifyContent}
                        alignItems="center"
                        className={classes.contentWrapper}
                        {...contentWrapperProps}
                    >
                        {childGroups.has(DashboardDataContents) && childGroups.get(DashboardDataContents)?.map((child, index) => (
                            <Box key={index} className={cx(classes.graphWrapper, graphWrapperProps.className)}>
                                {child}
                            </Box>
                        ))}
                        {childGroups.has(DashboardDataLegend) && childGroups.get(DashboardDataLegend)?.map((child, index) => (
                            <Box key={index}>
                                {child}
                            </Box>
                        ))}
                    </Grid>
                </Suspense>
            </QueryErrorBoundary>
        </DashboardCard>
    )
}

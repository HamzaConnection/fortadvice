import { type ComponentType, type PropsWithChildren } from "react"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import { Grid, Typography } from "@mui/material"
import { faUserRobotXmarks } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeStyles } from "tss-react/mui"
import { LocalizedStrict } from "../../../modules/localization/components/AppLocalized"

const useStyles = makeStyles()((_theme) => ({
    contentWrapper: {
        width: "100%",
        height: "100%",
        paddingTop: "10%",
        paddingBottom: "10%",
        paddingLeft: "10%",
        paddingRight: "10%",
        textAlign: "center",
    },
}))

export function InlineFallbackContents({}: FallbackProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" justifyContent="space-between" alignItems="center" className={classes.contentWrapper}>
            <FontAwesomeIcon icon={faUserRobotXmarks} size="2x" />
            <LocalizedStrict id="inline-error-boundary-message">
                <Typography variant="subtitle2">Could not render contents</Typography>
            </LocalizedStrict>
        </Grid>
    )
}

type Props = Readonly<PropsWithChildren<{
    Fallback?: ComponentType<FallbackProps>
}>>

export function InlineErrorBoundary({ Fallback, children }: Props) {
    return (
        <ErrorBoundary FallbackComponent={Fallback ? Fallback : InlineFallbackContents}>
            {children}
        </ErrorBoundary>
    )
}

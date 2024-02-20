import { PropsWithChildren } from "react";
import { Grid, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme) => ({
    cardGroup: {
        gap: "2rem",
    },
    cardGroupSubtitle: {
        color: theme.palette.tailwind.slate[400],
    },
    cardGroupCardArea: {
        gap: "2rem",
    },
    dashboard: {
        paddingTop: "4rem",
        gap: "4rem",
    },
}))

type DashboardCardGroupProps = Readonly<PropsWithChildren<{
    title?: string
    subtitle?: string
}>>

export function DashboardCardGroup({ title, subtitle, children }: DashboardCardGroupProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.cardGroup}>
            <Typography variant="h3">{title} {subtitle && (
                <Typography display="inline" variant="h6" className={classes.cardGroupSubtitle}>{subtitle}</Typography>
            )}</Typography>
            <Grid container className={classes.cardGroupCardArea}>
                {children}
            </Grid>
        </Grid>
    )
}

type DashboardProps = Readonly<PropsWithChildren<{}>>

export function Dashboard({ children }: DashboardProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.dashboard}>
            {children}
        </Grid>
    )
}

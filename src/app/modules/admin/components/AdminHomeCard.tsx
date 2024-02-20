import { Box } from "@mui/system"
import { makeStyles } from "tss-react/mui"
import { Button, Grid, IconButton, Typography } from "@mui/material"
import { faPlusCircle } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { PropsWithChildren } from "react"

const accentColor = "#2196F3"

const useStyles = makeStyles()((theme) => ({
    tenantCard: {
        width: 328,
        minHeight: "13rem",
        padding: theme.spacing(4),
        boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
        borderRadius: theme.spacing(1.5),
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#f1f5f9",
        background: theme.palette.common.white,
    },
    cardContentArea: {
        height: "100%",
    },
    cardHeadingDescriptionArea: {
        gap: theme.spacing(3.5),
    },
    cardHeading: {
        height: theme.spacing(3.5),
    },
    cardTitle: {
        "&.MuiTypography-root": {
            fontSize: `1.25rem`,
            fontWeight: 600,
            color: "#334155",
        },
    },
    cardDescription: {
        color: "#475569",
    },
    cardText: {
        "&.MuiButtonBase-root, &.MuiTypography-root": {
            fontSize: `0.875rem`,
            fontWeight: 400,
            padding: 0,
            boxSizing: "border-box",
            lineHeight: 1.5,
            fontStyle: "normal",
            textTransform: "none",
            minWidth: "auto",
        },
    },
    accentColor: {
        color: accentColor,
    },
    cardGroup: {
        gap: "2rem",
    },
    cardGroupCards: {
        gap: "1.5rem",
    },
    cardGroups: {
        gap: "4rem",
    }
}))

export type AdminHomeCardProps = Readonly<{
    title: string
    description: string
    onCreateClick?: () => void
    onShowAllClick: () => void
}>

export function AdminHomeCard({ title, description, onCreateClick, onShowAllClick }: AdminHomeCardProps) {
    const { classes, cx } = useStyles()

    return (
        <Box className={classes.tenantCard}>
            <Grid container direction="column" wrap="nowrap" justifyContent="space-between" className={classes.cardContentArea}>
                <Grid container direction="column" wrap="nowrap" className={classes.cardHeadingDescriptionArea}>
                    <Grid container wrap="nowrap" justifyContent={onCreateClick ? "space-between" : "flex-start"} alignItems="center" className={classes.cardHeading}>
                        <Typography variant="h5" className={classes.cardTitle}>
                            {title}
                        </Typography>
                        {onCreateClick && (
                            <IconButton onClick={onCreateClick}>
                                <FontAwesomeIcon className={classes.accentColor} icon={faPlusCircle} fontSize={32} />
                            </IconButton>
                        )}
                    </Grid>
                    <Box>
                        <Typography variant="body1" className={cx(classes.cardText, classes.cardDescription)}>
                            {description}
                        </Typography>
                    </Box>
                </Grid>
                <Box>
                    <LocalizedStrict id="admin-home-card-show-all-button">
                        <Button className={cx(classes.cardText, classes.accentColor)} onClick={onShowAllClick}>
                            Show all
                        </Button>
                    </LocalizedStrict>
                </Box>
            </Grid>
        </Box>
    )
}

type AdminHomeCardGroupProps = Readonly<PropsWithChildren<{
    title: string
}>>

export function AdminHomeCardGroup({ title, children }: AdminHomeCardGroupProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.cardGroup}>
            <Typography variant="h4">{title}</Typography>
            <Grid container className={classes.cardGroupCards}>
                {children}
            </Grid>
        </Grid>
    )
}

type AdminHomeCardGroupsProps = Readonly<PropsWithChildren<{}>>

export function AdminHomeCardGroups({ children }: AdminHomeCardGroupsProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.cardGroups}>
            {children}
        </Grid>
    )
}

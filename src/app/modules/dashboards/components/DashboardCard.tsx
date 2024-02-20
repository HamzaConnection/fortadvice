import { PropsWithChildren } from 'react'
import { Card, CardContent, CardContentProps, CardProps, Divider, Grid, IconButton, Typography, TypographyProps } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { InlineErrorBoundary } from '../../../shared/components/errors/InlineErrorBoundary'
import { ChevronRight } from '@mui/icons-material'

const useStyles = makeStyles()((theme) => ({
    card: {
        width: "17.5rem",
        height: "17.5rem",
        padding: "2rem",
        paddingTop: "1.5rem",
        borderRadius: "12px",
    },
    title: {
        paddingBottom: "0.25rem",
    },
    subtitle: {
        color: theme.palette.tailwind.slate[400],
    },
    titleButton: {
        marginRight: "-1rem",
    },
    cardContent: {
        height: "100%",
        width: "100%",
        padding: 0,
        "&:last-child": {
            paddingBottom: 0,
        },
    },
}))

export type DashboardCardProps = Readonly<PropsWithChildren<{
    title?: string
    subtitle?: string
    onClick?: () => void
    slotProps?: {
        card?: CardProps
        cardContent?: CardContentProps
        title?: TypographyProps
    }
}>>

export function DashboardCard({ title, subtitle, slotProps = {}, children, onClick }: DashboardCardProps) {
    const { classes, cx } = useStyles()

    const {
        card: cardProps = {},
        cardContent: cardContentProps = {},
        title: titleProps = {},
    } = slotProps

    return (
        <Card {...cardProps} variant="outlined" className={cx(classes.card, cardProps.className)}>
            <Grid container direction="column" wrap="nowrap" height="100%">
                <Grid container wrap="nowrap" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" {...titleProps} className={cx(classes.title, titleProps.className)}>
                        {title} {subtitle && (
                            <Typography variant="subtitle2" display="inline" className={classes.subtitle}>{subtitle}</Typography>
                        )}
                    </Typography>
                    {onClick && (
                        <IconButton onClick={onClick} className={classes.titleButton}>
                            <ChevronRight />
                        </IconButton>
                    )}
                </Grid>

                <Divider />

                <Grid item flexGrow={1}>
                    <CardContent {...cardContentProps} className={cx(classes.cardContent, cardContentProps.className)}>
                        <Grid container direction="column" wrap="nowrap" justifyContent="center" alignItems="center" height="100%">
                            <InlineErrorBoundary>
                                {children}
                            </InlineErrorBoundary>
                        </Grid>
                    </CardContent>
                </Grid>
            </Grid>
        </Card >
    )
}

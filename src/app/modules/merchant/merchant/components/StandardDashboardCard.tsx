import { Typography, TypographyProps } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { DashboardCard } from '../../../dashboards/components/DashboardCard'

const useStyles = makeStyles()((_theme) => ({
    dataNumber: {
        fontWeight: "bold", fontSize: "3rem"
    },
    dataText: {
        fontWeight: "bold", fontSize: "1.5rem", paddingTop: "0.8rem"
    }
}))

type StandardDashboardCardProps = Readonly<{
    title?: string
    subtitle?: string
    data: string | number | undefined
    variant: "text" | "number"
    slotProps?: {
        title?: TypographyProps
        data?: TypographyProps
    }
}>

export function StandardDashboardCard({ title, subtitle, data, variant, slotProps = {} }: StandardDashboardCardProps) {
    const { classes, cx } = useStyles()
    const { title: titleProps = {}, data: dataProps = {} } = slotProps

    return (
        <DashboardCard title={title} subtitle={subtitle} slotProps={{ title: titleProps }}>
            <Typography {...dataProps} variant="h2" className={variant === "number" ? classes.dataNumber : classes.dataText}>
                {data}
            </Typography>
        </DashboardCard>
    )
}

import { Grid, Typography } from '@mui/material'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { DashboardCardProps } from '../../../../dashboards/components/DashboardCard'
import { DashboardDataCard, DashboardDataContents, DashboardDataLegend } from '../../../../dashboards/components/DashboardDataCard'
import { UseSmileySummary, useSmileySummary } from '../hooks/useSmileySummary'

ChartJS.register(
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend
)

type ChartProps = UseSmileySummary

function ParticipationChart(props: ChartProps) {
    const { l10n } = useAppLocalization()
    const data = useSmileySummary(props)

    const ratingsSummary = data.ratingsSummary

    return (
        <Doughnut
            data={{
                labels: [
                    l10n.getString("survey-participation-card-participants-label"),
                    l10n.getString("survey-participation-card-non-participants-label"),
                ],
                datasets: [
                    {
                        label: l10n.getString("survey-participation-card-participation-label"),
                        data: [ratingsSummary.participationPercentage, (100 - (ratingsSummary.participationPercentage))
                        ],
                        backgroundColor: [
                            '#3CAE76',
                            '#bdbdbd',

                        ],
                        borderColor: [
                            '#3CAE76',
                            '#bdbdbd',

                        ],
                        borderWidth: 1,
                    },
                ],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            }}
        />
    )
}

type LegendProps = UseSmileySummary

function ParticipationLegend(props: LegendProps) {
    const data = useSmileySummary(props)
    const ratingsSummary = data.ratingsSummary

    return (
        <Grid container direction="column" wrap="nowrap">
            <LocalizedStrict
                id="survey-participation-card-participation-breakdown"
                vars={{
                    ratings: ratingsSummary.numberOfRatings,
                    orders: ratingsSummary.numberOfOrders
                }}
            >
                <Typography variant="caption" align="center" sx={{ paddingTop: "1rem", color: "#555555" }}>
                    {`${ratingsSummary.numberOfRatings} ratings of ${ratingsSummary.numberOfOrders} orders`}
                </Typography>
            </LocalizedStrict>
            <Typography variant="h6" align="center" sx={{ color: "#3CAE76", fontWeight: 'bold' }}>
                {ratingsSummary.participationPercentage}%
            </Typography>
        </Grid>
    )
}

type CardProps = ChartProps & Readonly<{
    slotProps?: DashboardCardProps["slotProps"]
}>

export function ParticipationCard({ slotProps = {}, ...rest }: CardProps) {
    return (
        <LocalizedStrict id="survey-participation-card" attrs={{ title: true }}>
            <DashboardDataCard
                title="Participation"
                dependencies={rest}
                slotProps={slotProps}
            >
                <DashboardDataContents>
                    <ParticipationChart {...rest} />
                </DashboardDataContents>
                <DashboardDataLegend>
                    <ParticipationLegend {...rest} />
                </DashboardDataLegend>
            </DashboardDataCard>
        </LocalizedStrict>
    )
}

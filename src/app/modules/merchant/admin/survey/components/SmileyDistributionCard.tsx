import { useMemo } from 'react'
import { makeStyles } from 'tss-react/mui'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    BarController,
    LineController,
    type Plugin,
} from 'chart.js'
import { Chart } from 'react-chartjs-2'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { type DashboardCardProps } from '../../../../dashboards/components/DashboardCard'
import { DashboardDataCard, DashboardDataContents } from '../../../../dashboards/components/DashboardDataCard'
import { type UseSmileySummary, useSmileySummary } from '../hooks/useSmileySummary'
import { displaySmiley } from './SmileySummaryCard'

ChartJS.register(
    LineController,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
)

const useStyles = makeStyles()((_theme) => ({
    graphWrapper: {
        height: "15rem",
        width: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
    },
}))

type ChartProps = UseSmileySummary

function DistributionChart(props: ChartProps) {
    const { l10n } = useAppLocalization()
    const rawData = useSmileySummary(props)

    const data = useMemo(
        () => rawData.smileysSummaries.slice().sort((x, y) => y.value - x.value),
        [rawData.smileysSummaries],
    )

    // TODO: Finish styling the smileys so this plugin can be used
    const plugins = useMemo<Plugin<"bar">[]>(() => [
        {
            id: "drawSmileys",
            afterDraw(chart, _args, _options) {
                var ctx =  chart.ctx
                var xAxis = chart.scales["x"]
                var yAxis = chart.scales["y"]

                yAxis.ticks.forEach((value, index) => {
                    if (value.label && typeof value.label === "string") {
                        var y = yAxis.getPixelForTick(index)
                        var image = new Image()
                        image.src = displaySmiley(value.label)
                        ctx.drawImage(image, xAxis.left, y, 40, 40)
                    }
                })
            },
        }
    ], [])

    return (
        <Chart
            style={{ width: "100%" }}
            type="bar"
            data={{
                labels: data.map(smiley => l10n.getStringForEnum("smiley-label", smiley.label, smiley.label)),
                datasets: [
                    {
                        type: "bar" as const,
                        label: l10n.getString("survey-smiley-distribution-card-votes-label"),
                        data: data.map(smiley => smiley.numberOfRatings),
                        backgroundColor: ["#3CAE76", "#74C462", "#EBA540", "#E85744", "#EE1E25"],
                        xAxisID: "x",
                        yAxisID: "y",
                    }
                ]
            }}
            options={{
                plugins: {
                    legend: {
                        display: false
                    }
                },
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: "linear" as const,
                        display: true,
                        position: "left" as const,
                        grid: {
                            display: false
                        },
                        ticks: {
                            stepSize: 1,
                        },
                    },
                    y: {
                        grid: {
                            display: false
                        },
                    }
                },
            }}
            // TODO: Enable smiley plugin when it is ready
            //plugins={plugins}
        />
    )
}

type CardProps = ChartProps & Readonly<{
    slotProps?: DashboardCardProps["slotProps"]
}>

export function SmileyDistributionCard({ slotProps, ...rest }: CardProps) {
    const { classes } = useStyles()

    return (
        <LocalizedStrict id="survey-smiley-distribution-card" attrs={{ title: true }}>
            <DashboardDataCard
                title="Satisfaction"
                dependencies={rest}
                slotProps={{
                    ...slotProps,
                    graphWrapper: { className: classes.graphWrapper }
                }}
            >
                <DashboardDataContents>
                    <DistributionChart {...rest} />
                </DashboardDataContents>
            </DashboardDataCard>
        </LocalizedStrict>
    )
}

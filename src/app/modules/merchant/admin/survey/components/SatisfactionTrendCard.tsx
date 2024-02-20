import { useCallback, useMemo } from 'react'
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
    BubbleController,
    TimeScale,
    TimeSeriesScale,
} from 'chart.js'
import "chartjs-adapter-luxon"
import { Chart } from 'react-chartjs-2'
import { NoDataError } from '../../../../../core/api/errorTypes'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { DashboardCardProps } from '../../../../dashboards/components/DashboardCard'
import { DashboardDataCard, DashboardDataContents } from '../../../../dashboards/components/DashboardDataCard'
import { DailyRatings } from '../surveyTypes'
import { Period } from '../../../../dashboards/dashboardTypes'
import { fetchDailyRatings } from '../surveyReportApi'


ChartJS.register(
    LineController,
    BarController,
    BubbleController,
    CategoryScale,
    LinearScale,
    TimeScale,
    TimeSeriesScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
)

ChartJS.defaults.font.family = "Roboto"

const useStyles = makeStyles()((_theme) => ({
    graphWrapper: {
        height: "15rem",
        width: "100%",
        paddingLeft: "1rem",
        paddingRight: "1rem",
    },
}))

type ChartProps = Readonly<{
    surveyId: number
    questionId: number
    period: Period
    scoreLabel: string
    votesLabel: string
}>

function TrendChart({ surveyId, questionId, period, scoreLabel, votesLabel }: ChartProps) {
    const questionFilter = useCallback(
        (data: DailyRatings) => data.questions.find((q) => q.id === questionId),
        [questionId],
    )

    const { data } = useApiQuery(fetchDailyRatings, {
        queryName: "survey-daily-ratings",
        dependencies: {
            surveyId,
            period,
        },
        select: questionFilter,
        suspense: true,
        useErrorBoundary: true,
    })

    if (!data) throw new NoDataError()

    const dailyRatings = useMemo(() => {
        const ratings = data.ratingsSummaries ?? []
        if (ratings.length === 0) throw new NoDataError()
        return ratings.slice().sort((x, y) => x.date.localeCompare(y.date))
    }, [data])

    return (
        <Chart
            type="bar"
            data={{
                labels: dailyRatings.map((element) => element.date),
                datasets: [
                    {
                        type: "line" as const,
                        label: scoreLabel,
                        data: dailyRatings.map((element) => element.averageScore),
                        borderColor: "#FD3B3B",
                        borderWidth: 2,
                        yAxisID: "y1",
                    },
                    {
                        type: "bar" as const,
                        label: votesLabel,
                        data: dailyRatings.map((element) => element.numberOfRatings),
                        backgroundColor: "#7CA7E7",
                        yAxisID: "y",
                    },

                ]
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: 'top' as const,
                        align: "end" as const,
                        labels: {
                            boxWidth: 20,
                            useBorderRadius: true,
                            borderRadius: 5,
                        }
                    },
                },
                elements: {
                    point: {
                        radius: 2,
                    },
                    line: {
                        tension: 0.4
                    },
                },
                scales: {
                    x: {
                        type: "time" as const,
                        time: {
                            minUnit: "day",
                        },
                        ticks: {
                            maxTicksLimit: 10,
                        },
                    },
                    y: {
                        type: "linear" as const,
                        display: true,
                        position: "left" as const,
                        ticks: {
                            stepSize: 1,
                        },
                        suggestedMax: 10,
                        title: {
                            display: true,
                            text: votesLabel,
                        },
                    },
                    y1: {
                        type: "linear" as const,
                        display: true,
                        position: "right" as const,
                        grid: {
                            drawOnChartArea: false,
                        },
                        min: 0,
                        max: 5,
                        title: {
                            display: true,
                            text: scoreLabel,
                        },
                    }
                }
            }}
        />
    )
}

type CardProps = ChartProps & Readonly<{
    title: string
    slotProps?: DashboardCardProps["slotProps"]
}>

export function SatisfactionTrendCard({ title, slotProps, ...rest }: CardProps) {
    const { scoreLabel, votesLabel, ...queryDeps } = rest
    const { classes } = useStyles()

    return (
        <DashboardDataCard
            title={title}
            dependencies={queryDeps}
            slotProps={{ ...slotProps, graphWrapper: { className: classes.graphWrapper } }}
        >
            <DashboardDataContents>
                <TrendChart {...rest} />
            </DashboardDataContents>
        </DashboardDataCard>
    )
}

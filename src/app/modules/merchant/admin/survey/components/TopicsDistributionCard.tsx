import { useCallback, useMemo } from "react"
import { makeStyles } from "tss-react/mui"
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js"
import { Bar } from "react-chartjs-2"
import { NoDataError } from "../../../../../core/api/errorTypes"
import { useApiQuery } from "../../../../../core/api/useApiQuery"
import { DashboardCardProps } from "../../../../dashboards/components/DashboardCard"
import { DashboardDataCard, DashboardDataContents } from "../../../../dashboards/components/DashboardDataCard"
import { type TopicVoteDistribution } from "../surveyTypes"
import { Period } from '../../../../dashboards/dashboardTypes'
import { fetchTopicVotes } from "../surveyReportApi"

type TopicType = "good" | "bad"

ChartJS.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
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

type ChartProps = Readonly<{
    surveyId: number
    questionId: number
    period: Period
    topicType: TopicType
    datasetLabel: string
}>

function DistributionChart({ surveyId, questionId, period, topicType, datasetLabel }: ChartProps) {
    const questionFilter = useCallback(
        (data: TopicVoteDistribution) => data.questions.find((q) => q.id === questionId),
        [questionId],
    )

    const { data: rawData } = useApiQuery(fetchTopicVotes, {
        queryName: "survey-topic-votes",
        dependencies: {
            surveyId,
            period,
        },
        select: questionFilter,
        suspense: true,
        useErrorBoundary: true,
    })

    if (!rawData) throw new NoDataError()

    const data = useMemo(
        () => {
            const topics = (topicType === "good" ? rawData.goodTopics : rawData.badTopics) ?? []
            if (topics.length === 0) throw new NoDataError()
            return topics.slice().sort((x, y) => y.numberOfRatings - x.numberOfRatings)
        },
        [rawData],
    )

    const barColor = topicType === "good" ? "#5EC77C" : "#F27474"

    return (
        <Bar
            data={{
                labels: data.map((topicVotes) => topicVotes.topic),
                datasets: [
                    {
                        type: "bar" as const,
                        label: datasetLabel,
                        data: data.map((topicVotes) => topicVotes.numberOfRatings),
                        backgroundColor: barColor,
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
                            display: false,
                        },
                    }
                },

            }}
        />
    )
}

type CardProps = ChartProps & Readonly<{
    title: string
    slotProps?: DashboardCardProps["slotProps"]
}>

export function TopicsDistributionCard({ title, slotProps, ...rest }: CardProps) {
    const { topicType, datasetLabel, ...queryDeps } = rest
    const { classes } = useStyles()

    return (
        <DashboardDataCard
            title={title}
            dependencies={queryDeps}
            slotProps={{
                ...slotProps,
                graphWrapper: { className: classes.graphWrapper }
            }}
        >
            <DashboardDataContents>
                <DistributionChart {...rest} />
            </DashboardDataContents>
        </DashboardDataCard>
    )
}

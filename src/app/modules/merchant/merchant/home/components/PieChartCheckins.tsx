import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, DoughnutController, type Plugin as ChartPlugin } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { useAppSelector } from '../../../../store/storeHooks'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { DashboardDataCard, DashboardDataContents } from '../../../../dashboards/components/DashboardDataCard'
import { CheckinSummary } from '../merchantHomeTypes'
import { fetchCheckInSummary } from '../merchantHomeApi'
import { Period } from '../../../../dashboards/dashboardTypes'

ChartJS.register(
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend
)

type ChartProps = Readonly<{
    summary: CheckinSummary
}>

function Chart({ summary }: ChartProps) {
    const { checkInsPercentage, noCheckInsPercentage, numberOfCheckIns, numberOfOrders } = summary

    const { l10n } = useAppLocalization()

    const plugins = useMemo<ChartPlugin<"doughnut">[]>(() => [
        {
            id: "center-text",
            afterDraw(chart, _args, _options) {
                const width = chart.chartArea.width
                const height = chart.chartArea.height
                const ctx = chart.ctx

                ctx.restore()
                ctx.font = `normal 500 1.25rem Roboto`
                ctx.textBaseline = "top"

                const text = `${checkInsPercentage}%`
                const textDims = ctx.measureText(text)
                const textHeight = textDims.actualBoundingBoxAscent + textDims.actualBoundingBoxDescent

                const textX = Math.round((width - textDims.width) / 2)
                const textY = Math.round((height - textHeight) / 2)

                ctx.fillText(text, textX, textY)
                ctx.save()
            },
        }
    ], [checkInsPercentage])

    const data = useMemo(() => {
        return {
            labels: [
                l10n.getString("merchant-home-checkin-card-participants", { checkedIn: numberOfCheckIns }),
                l10n.getString("merchant-home-checkin-card-none-participants", { notCheckedIn: (numberOfOrders - numberOfCheckIns) })
            ],
            datasets: [
                {
                    label: l10n.getString("merchant-home-checkin-card-participation-percentage"),
                    data: [checkInsPercentage, noCheckInsPercentage],
                    backgroundColor: [
                        '#22C55E',
                        '#FCA5A5',

                    ],
                    borderColor: [
                        '#22C55E',
                        '#FCA5A5',

                    ],
                    borderWidth: 1,
                },
            ],
        }
    }, [l10n, numberOfCheckIns, numberOfOrders, checkInsPercentage, noCheckInsPercentage])

    return (
        <Doughnut
            data={data}
            options={{
                responsive: true,
                maintainAspectRatio: true,
                cutout: "65%",
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: {
                            boxWidth: 7,
                            boxHeight: 7,
                            usePointStyle: true,
                            useBorderRadius: true,
                            pointStyle: "circle",
                            textAlign: "center",
                        },
                    },
                },
            }}
            plugins={plugins}
        />
    )
}

function DataLoader() {
    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const checkInSummary = useApiQuery(fetchCheckInSummary, {
        queryName: "check-in-summary",
        dependencies: {
            merchantId: merchantId ?? 0,
            period: Period.LAST_MONTH,
        },
        enabled: merchantId !== undefined,
        suspense: true,
        useErrorBoundary: true,
    })

    return (
        <>
            {checkInSummary.data && (
                <Chart summary={checkInSummary.data.checkInSummary} />
            )}
        </>
    )
}

type PieChartCheckinsProps = Readonly<{
    title?: string
}>

export function PieChartCheckins({ title }: PieChartCheckinsProps) {
    return (
        <LocalizedStrict id="merchant-home-checkin-card" attrs={{ title: !title }}>
            <DashboardDataCard title={title}>
                <DashboardDataContents>
                    <DataLoader />
                </DashboardDataContents>
            </DashboardDataCard>
        </LocalizedStrict>
    )
}

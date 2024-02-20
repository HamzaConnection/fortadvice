import { transformScale } from 'dinero.js'
import { useMoney } from '../../../../currency/useMoney'
import { toDinero } from '../../../../currency/currencyLib'
import { useAppSelector } from '../../../../store/storeHooks'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { Dashboard, DashboardCardGroup } from "../../../../dashboards/components/Dashboard"
import { StandardDashboardCard } from '../../components/StandardDashboardCard'
import { fetchTodaysControlCode, fetchTodaysPosSales } from '../merchantHomeApi'
import { PieChartCheckins } from '../components/PieChartCheckins'
import { SurveySummaries } from "../components/SurveySummaries"
import { MatchEnvironment } from '../../../../environment/components/MatchEnvironment'
import { EnvironmentType } from '../../../../environment/envTypes'

function isValidControlCode(code: string | number | undefined) {
    if (code === undefined) return false
    if (typeof code === "number") return true

    return !Number.isNaN(Number(code))
}

type MerchantHomeProps = Readonly<{}>

export function MerchantReportsHome({ }: MerchantHomeProps) {
    const merchantId = useAppSelector(selectEffectiveCompanyId)
    const moneyFactory = useMoney({})

    const todaysControlCode = useApiQuery(fetchTodaysControlCode, {
        queryName: "todays-control-code",

        dependencies: {
            merchantId: merchantId ?? 0,
        },
        enabled: merchantId !== undefined
    })

    const todaysPosSales = useApiQuery(fetchTodaysPosSales, {
        queryName: "todays-POS-sales",
        dependencies: {
            merchantId: merchantId ?? 0,
        },
        enabled: merchantId !== undefined
    })

    return (
        <Dashboard>
            <LocalizedStrict id="merchant-home-today-card-group" attrs={{ title: true, subtitle: true }}>
                <DashboardCardGroup title="Today">
                    <LocalizedStrict id="merchant-home-number-of-orders" attrs={{ title: true }}>
                        <StandardDashboardCard
                            variant='number'
                            title="POS orders"
                            data={todaysPosSales.data?.posSale.numberOfOrders}
                        />
                    </LocalizedStrict>
                    {todaysPosSales.data && (
                        <LocalizedStrict id="merchant-home-turnover" attrs={{ title: true }}>
                            <StandardDashboardCard
                                variant='number'
                                title="POS turnover"
                                subtitle={todaysPosSales.data.posSale.totalAmount.currency}
                                data={moneyFactory.formatAsNumberWithScale(transformScale(toDinero(todaysPosSales.data?.posSale.totalAmount), 0), "value")}
                            />
                        </LocalizedStrict>
                    )}
                    <LocalizedStrict id="merchant-home-todays-control-code" attrs={{ title: true }}>
                        <StandardDashboardCard
                            variant={isValidControlCode(todaysControlCode.data?.receipt.controlCode) ? "number" : "text"}
                            title="Todays control code"
                            slotProps={{ data: { color: "#2196F3" } }}
                            data={todaysControlCode.data?.receipt.controlCode} />
                    </LocalizedStrict>
                </DashboardCardGroup>
            </LocalizedStrict>

            <LocalizedStrict id="merchant-home-health-card-group" attrs={{ title: true, subtitle: true }}>
                <DashboardCardGroup title="Health" subtitle="last month">
                    <PieChartCheckins />
                    <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test, EnvironmentType.Demo]}>
                        <SurveySummaries />
                    </MatchEnvironment>
                </DashboardCardGroup>
            </LocalizedStrict>
        </Dashboard>
    )
}

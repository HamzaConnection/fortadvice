import { Suspense } from "react"
import { FallbackProps } from "react-error-boundary"
import { Skeleton } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { useAppSelector } from "../../../../store/storeHooks"
import { LocalizedStrict } from "../../../../localization/components/AppLocalized"
import { selectEffectiveCompanyId } from "../../../../context/contextSelectors"
import { useApiQuery } from "../../../../../core/api/useApiQuery"
import { QueryErrorFallback, QueryErrorBoundary } from "../../../../../core/api/components/QueryErrorBoundary"
import { DashboardCard } from "../../../../dashboards/components/DashboardCard"
import { SmileyExtSummaryCard } from "../../../admin/survey/components/SmileySummaryCard"
import { fetchSurveyRatingSummaries } from "../merchantHomeApi"
import { Period } from '../../../../dashboards/dashboardTypes'

const useStyles = makeStyles()((_theme) => ({
    smileyImage: {
        height: "7rem",
    },
}))

function ContentLoader() {
    const { classes } = useStyles()
    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const { data } = useApiQuery(fetchSurveyRatingSummaries, {
        queryName: "survey-rating-summaries",
        dependencies: {
            merchantId: merchantId ?? 0,
            period: Period.LAST_MONTH,
        },
        enabled: Boolean(merchantId),
        suspense: true,
        useErrorBoundary: true,
    })

    return (
        <>
            {data?.surveys.map((survey) => (
                <SmileyExtSummaryCard
                    title={survey.name ?? survey.title ?? ""}
                    surveyId={survey.id}
                    smileySummary={survey.ratingsSummary}
                    slotProps={{
                        image: { className: classes.smileyImage }
                    }}
                />
            ))}
        </>
    )
}

function ErrorFallback(props: FallbackProps) {
    return (
        <LocalizedStrict id="merchant-home-survey-card-empty" attrs={{ title: true }}>
            <DashboardCard title="Survey">
                <QueryErrorFallback {...props} />
            </DashboardCard>
        </LocalizedStrict>
    )
}

export function SurveySummaries() {
    return (
        <QueryErrorBoundary Fallback={ErrorFallback}>
            <Suspense fallback={<Skeleton variant="rectangular" animation="wave" height="17.5rem" width="17.5rem" />}>
                <ContentLoader />
            </Suspense>
        </QueryErrorBoundary>
    )
}

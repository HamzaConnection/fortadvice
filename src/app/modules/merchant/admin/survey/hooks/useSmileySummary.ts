import { useCallback } from "react"
import { NoDataError } from "../../../../../core/api/errorTypes"
import { useApiQuery } from "../../../../../core/api/useApiQuery"
import { type SmileySummaryReport } from "../surveyTypes"
import { Period } from '../../../../dashboards/dashboardTypes'
import { fetchSmileySummary } from "../surveyReportApi"

export type UseSmileySummary = Readonly<{
    surveyId: number
    questionId: number
    period: Period
}>

export function useSmileySummary({ surveyId, questionId, period }: UseSmileySummary) {
    const questionFilter = useCallback(
        (data: SmileySummaryReport) => data.questions.find((q) => q.id === questionId),
        [questionId],
    )

    const queryResult = useApiQuery(fetchSmileySummary, {
        queryName: "survey-smiley-summary",
        dependencies: {
            surveyId,
            period,
        },
        select: questionFilter,
        suspense: true,
        useErrorBoundary: true,
    })

    if (!queryResult.data) throw new NoDataError()

    return queryResult.data
}

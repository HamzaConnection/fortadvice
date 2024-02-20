import { useCallback } from "react";
import { StrictOmit } from "../../../../../lib/lang";
import { useApiQuery } from "../../../../../core/api/useApiQuery";
import { useMerchant } from "../../../../merchants/merchantHooks";
import { fetchAllSurveys } from "../surveyReportApi";
import { SelectSurvey, SelectSurveyProps } from "../components/SelectSurvey";

type SelectQueryLeftoverProps = StrictOmit<SelectSurveyProps, "surveys" | "initialSurveyId" | "isLoading" | "isError" | "onRetry">

export function useSurveys(surveyId?: number | null) {
    const { merchantId } = useMerchant()

    const surveysResult = useApiQuery(fetchAllSurveys, {
        queryName: "surveys-for-merchant",
        dependencies: {
            merchantId,
        },
    })

    const selectSurvey = useCallback((props: SelectQueryLeftoverProps) => (
        <SelectSurvey
            surveys={surveysResult.data?.surveys}
            initialSurveyId={surveyId}
            isLoading={surveysResult.isInitialLoading}
            isError={surveysResult.isError}
            onRetry={surveysResult.refetch}
            {...props}
        />
    ), [surveysResult.data, surveysResult.isLoading, surveysResult.isError])

    return {
        surveysResult,
        SelectSurvey: selectSurvey,
    }
}

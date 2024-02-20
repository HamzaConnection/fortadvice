import { AxiosInstance } from 'axios'
import { AllRatingsReport, DailyRatings, SmileySummaryReport, Survey, TopicVoteDistribution } from './surveyTypes'
import { Period } from '../../../dashboards/dashboardTypes'


type FetchAllSurveysParams = Readonly<{
    merchantId: number | string | undefined
}>

export type FetchAllSurveysResponse = Readonly<{
    surveys: Survey[]
}>

export async function fetchAllSurveys({ merchantId }: FetchAllSurveysParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchAllSurveysResponse> {
    const url = `/merchants/${merchantId}/surveys`


    const response = await axios.get(url, {
        params: {

        },
        signal
    })

    return response.data
}



type FetchSmileySummaryParams = Readonly<{
    surveyId: number
    period: string
}>

export async function fetchSmileySummary({ surveyId, period }: FetchSmileySummaryParams, axios: AxiosInstance, signal?: AbortSignal): Promise<SmileySummaryReport> {
    const url = `/surveys/${surveyId}/smileys/summary`

    const response = await axios.get(url, {
        params: {
            period,
        },
        signal,
    })

    return response.data
}



type FetchDailyRatingsParams = Readonly<{
    surveyId: number
    period: Period
}>

export async function fetchDailyRatings({ surveyId, period }: FetchDailyRatingsParams, axios: AxiosInstance, signal?: AbortSignal): Promise<DailyRatings> {
    const url = `/surveys/${surveyId}/dailyRatings`

    const response = await axios.get(url, {
        params: {
            period,
        },
        signal,
    })

    return response.data
}



type FetchTopicVotesParams = Readonly<{
    surveyId: number
    period: Period
}>

export async function fetchTopicVotes({ surveyId, period }: FetchTopicVotesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<TopicVoteDistribution> {
    const url = `/surveys/${surveyId}/topics/summary`

    const response = await axios.get(url, {
        params: {
            period,
        },
        signal,
    })

    return response.data
}



type FetchAllRatingsParams = Readonly<{
    surveyId: number
    startDate: string
    endDate: string
}>

export async function fetchAllRatings({ surveyId, startDate, endDate }: FetchAllRatingsParams, axios: AxiosInstance, signal?: AbortSignal): Promise<AllRatingsReport> {
    const url = `/surveys/${surveyId}/ratings`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
        },
        signal,
    })

    return response.data
}

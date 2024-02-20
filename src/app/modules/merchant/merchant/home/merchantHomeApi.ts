import { AxiosInstance } from 'axios'
import { ReportDetails } from '../../controlKitchenApi'
import { SurveySummary } from '../../admin/survey/surveyTypes'
import { Period } from '../../../dashboards/dashboardTypes'
import { CheckinSummary, SalesSummary, ShopSalesSummary } from './merchantHomeTypes'



type FetchTodaysControlCodeParams = Readonly<{
    merchantId: number
}>

export type FetchTodaysControlCodeResponse = Readonly<{
    receipt: {
        controlCode: string | number
    }
}>

export async function fetchTodaysControlCode({ merchantId }: FetchTodaysControlCodeParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchTodaysControlCodeResponse> {
    const url = `/merchants/${merchantId}/dashboard/receipt/controlCode`

    const response = await axios.get(url, {
        params: {

        },
        signal
    })

    return response.data
}



type FetchShopSalesParams = Readonly<{
    merchantId: number
}>

export type FetchShopSalesResponse = Readonly<{
    reportDetails: ReportDetails
    reportSummary: SalesSummary
    shopSales: ShopSalesSummary[]
}>

export async function fetchShopSales({ merchantId }: FetchShopSalesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchShopSalesResponse> {
    const url = `/merchants/${merchantId}/dashboard/....`

    const response = await axios.get(url, {
        params: {

        },
        signal
    })

    return response.data
}



type FetchTodaysPosSalesParams = Readonly<{
    merchantId: number
}>

export type FetchTodaysPosSalesResponse = Readonly<{
    reportDetails: ReportDetails
    posSale: SalesSummary
}>

export async function fetchTodaysPosSales({ merchantId }: FetchTodaysPosSalesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchTodaysPosSalesResponse> {
    const url = `/merchants/${merchantId}/dashboard/posSale/today`

    const response = await axios.get(url, {
        params: {

        },
        signal
    })

    return response.data
}



type FetchCheckInSummaryParams = Readonly<{
    merchantId: number
    period: Period
}>

export type FetchCheckInSummaryResponse = Readonly<{
    reportDetails: ReportDetails
    checkInSummary: CheckinSummary
}>

export async function fetchCheckInSummary({ merchantId, period }: FetchCheckInSummaryParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchCheckInSummaryResponse> {
    const url = `/merchants/${merchantId}/dashboard/checkIns`

    const response = await axios.get(url, {
        params: {
            period,
        },
        signal,
    })

    return response.data
}



type FetchSurveySummaryParams = Readonly<{
    merchantId: number
    period: Period
}>

type FetchSurveySummaryResponse = Readonly<{
    surveys: SurveySummary[]
}>

export async function fetchSurveyRatingSummaries({ merchantId, period }: FetchSurveySummaryParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchSurveySummaryResponse> {
    const url = `/merchants/${merchantId}/dashboard/survey/ratingsSummary`

    const response = await axios.get(url, {
        params: {
            period,
        },
        signal,
    })

    return response.data
}

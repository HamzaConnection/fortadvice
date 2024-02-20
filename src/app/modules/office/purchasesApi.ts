import { AxiosInstance } from 'axios'
import { ReportDetails, ReportSummary } from '../merchant/controlKitchenApi'
import { Order } from './purchaseTypes'

type FetchPurchasesParams = Readonly<{
    companyId: number
    startDate: string
    endDate: string
    userGroupId: number
}>

type FetchPurchasesResponse = Readonly<{
    reportDetails: ReportDetails
    reportSummary: ReportSummary
    orders: Order[]
}>

export type TableOrder = Order & Readonly<{
    startDate: string,
    endDate: string
}>

export async function fetchPurchasesByPeriod({ companyId, startDate, endDate, userGroupId }: FetchPurchasesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchPurchasesResponse> {
    const url = `/companies/${companyId}/userGroups/${userGroupId}/accounting/pos/orders`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate
        },
        signal
    })

    return response.data
}

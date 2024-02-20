import { AxiosInstance } from 'axios'
import { MonetaryAmount } from '../currency/currencyTypes'
import { Order } from './controlKitchenTypes'
import { ControlKitchenMode } from './merchant/pages/ControlKitchen'

type FetchPurchasesParams = Readonly<{
    merchantId: number
    startTime: string
    endTime: string
    mode: ControlKitchenMode

}>

export type ReportDetails = Readonly<{
    startDate: string,
    endDate: string
    reportTime?: string

}>

export type ReportSummary = Readonly<{
    totalAmount?: MonetaryAmount
    numberOfTransactions?: number
    numberofOrders?: number
}>


export type FetchKitchenPurchasesResponse = Readonly<{
    reportDetails: ReportDetails

    reportSummary: ReportSummary
    orders: Order[]
    receipt: {
        controlCode: string
    }
}>

export type KitchenTableOrder = Order & Readonly<{
    startDate: string
    endDate: string
    orderLineNames: string
}>


export async function fetchKitchenPurchasesByPeriod({ merchantId, startTime, endTime, mode }: FetchPurchasesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchKitchenPurchasesResponse> {
    const url = `/merchants/${merchantId}/control/pos/orders`

    const response = await axios.get(url, {
        params: {
            startTime,
            endTime,
            mode,
        },
        signal
    })

    return response.data
}

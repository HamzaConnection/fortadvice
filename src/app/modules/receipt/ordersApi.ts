import { AxiosInstance } from "axios"
import { IMyOrderDetails } from "../payments/orderTypes"
import { TransactionResponse } from "../payments/transactionTypes"

type GetOrderDetailsParams = Readonly<{
    orderId: number
}>

export type GetOrderDetailsResponse = Readonly<{
    orders: IMyOrderDetails[]
}>

export async function getOrderDetails({ orderId }: GetOrderDetailsParams, axios: AxiosInstance, signal?: AbortSignal): Promise<GetOrderDetailsResponse> {
    const response = await axios.get(`/orders/${orderId}`)
    return response.data
}


type ForwardReceiptByEmailParams = Readonly<{
    recipientEmail: string
    orderUids: string[]
}>

type ForwardReceiptResponse = Readonly<{}>


export async function forwardReceiptByEmail({ recipientEmail, orderUids }: ForwardReceiptByEmailParams, axios: AxiosInstance): Promise<ForwardReceiptResponse> {
    const response = await axios.post("/public/receipts/sendByEmail", {
        data: {
            sendToEmail: recipientEmail,
            orders: orderUids.map(uid => ({ uid }))
        }
    })
    return response.data
}

type RefundOrderParams = Readonly<{
    orderId: number
}>

export async function refundOrder({ orderId }: RefundOrderParams, axios: AxiosInstance): Promise<TransactionResponse> {
    const response = await axios.delete(`/orders/${orderId}`)
    return response.data
}

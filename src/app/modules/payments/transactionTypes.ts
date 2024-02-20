import { objectHas } from "../../lib/lang";
import { IMyOrderDetails } from "./orderTypes";
import { isPaymentFlowDetails, isPaymentGatewayDetails, PaymentDetails } from "./paymentTypes";

interface ITransactionResponse {
    readonly message: string
    readonly subject: string
}

interface IPaymentPendingResponse {
    readonly paymentDetails: {
        readonly accepted: false
    }
}

interface IPaymentSuccessResponse {
    readonly paymentDetails: {
        readonly accepted: true
        readonly orderId: string
    }
    readonly order?: IMyOrderDetails
    readonly transactionResponse?: ITransactionResponse
}

export type IPaymentResponse = IPaymentPendingResponse | IPaymentSuccessResponse;

export function isPaymentSuccess(response: IPaymentResponse): response is IPaymentSuccessResponse {
    return response.paymentDetails.accepted
}

type SimpleTransactionResponse = Readonly <{
    transactionResponse: ITransactionResponse
}>

type PaymentPollingResponse = Readonly<{
    paymentDetails: PaymentDetails
}>

type OrderResponse = Readonly<{
    order: IMyOrderDetails
}>

type OrdersResponse = Readonly<{
    orders: IMyOrderDetails[]
}>

export type TransactionResponse =
    | SimpleTransactionResponse
    | PaymentPollingResponse
    | OrderResponse
    | OrdersResponse

export function isPaymentPollingResponse(response: TransactionResponse): response is PaymentPollingResponse {
    if (objectHas("paymentDetails", response)) {
        return (isPaymentGatewayDetails(response.paymentDetails) || isPaymentFlowDetails(response.paymentDetails))
    }

    return false
}

export function isOrdersResponse(response: TransactionResponse): response is OrdersResponse {
    if (objectHas("orders", response)) {
        return response.orders.length > 0
    }

    return false
}

export function isOrderResponse(response: TransactionResponse): response is OrderResponse {
    if (objectHas("order", response)) return true
    return false
}

export function getFallbackPaymentMethod(response: TransactionResponse) {
    if (isOrdersResponse(response)) return response.orders[0].payment?.method
    if (isOrderResponse(response)) return response.order.payment?.method

    return undefined
}

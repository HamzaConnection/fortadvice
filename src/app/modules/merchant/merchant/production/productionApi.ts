import { AxiosInstance } from 'axios'
import { MonetaryAmount } from '../../../currency/currencyTypes';
import { ReportDetails } from '../../controlKitchenApi';
import { Order, OrderStatus } from '../../controlKitchenTypes';



export type Shop = Readonly<{
    id: number;
    name: string;
    uid: string
    isActive: boolean;
}>;

export type ProductionReport = Readonly<{
    reportDetails: ReportDetails
    categories: [
        {
            name: string,
            products?: {
                id: number;
                name: string;
                dates: {
                    displayDay: string;
                    date: string;
                    dayInWeek: number;
                    sale: {
                        items: number;
                        amount: MonetaryAmount
                    };
                }[]
            }[]
        }


    ]

}>;





type FetchProductionListParams = Readonly<{
    startDate: string
    endDate: string
    merchantId: number
    shopId?: string

}>


type FetchAllShopsParams = Readonly<{
    merchantId: number

}>

export type FetchProductionListResponse = ProductionReport

export type FetchAllShopsResponse =
    {
        shops: Shop[]
    }



export async function fetchProductionListByPeriod({ startDate, endDate, merchantId, shopId }: FetchProductionListParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchProductionListResponse> {
    const url = `/merchants/${merchantId}/production/productionList`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId
        },
        signal
    })

    return response.data
}



export async function fetchAllShops({ merchantId }: FetchAllShopsParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchAllShopsResponse> {
    const url = `/merchants/${merchantId}/shops`

    const response = await axios.get(url, {
        params: {
        },
        signal
    })

    return response.data
}



type FetchOrdersParams = Readonly<{
    merchantId: number
    startDate: string
    endDate: string
    shopId?: string
    customerId?: string
    customerGroupId?: string
    isCancelled: boolean
}>

export type FetchOrdersResponse = Readonly<{
    orders: Order[] | null
}>

export async function fetchOrdersByPeriod(params: FetchOrdersParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchOrdersResponse> {
    const { shopId, startDate, endDate, merchantId, customerId, customerGroupId, isCancelled } = params
    const url = `/merchants/${merchantId}/production/orders`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
            customerId,
            customerGroupId,
            isCancelled,
        },
        signal
    })

    return response.data
}


type SaveReceiptAsFileParams = Readonly<{
    orderIds: number[]
}>

export type SaveReceiptAsFileResponse = Blob


export async function saveReceiptAsFile({ orderIds }: SaveReceiptAsFileParams, axios: AxiosInstance, signal?: AbortSignal): Promise<SaveReceiptAsFileResponse> {
    const url = `/receipts/doc`

    const response = await axios.post(url, {
        "orderIds": orderIds,
    }, {
        headers: {
            "Accept": "application/pdf",
        },
        responseType: "arraybuffer",
    })

    const result = new Blob([response.data], {
        type: response.headers["content-type"]?.toString() ?? "application/pdf"
    })

    return result
}



type MessageParams = Readonly<{
    message: {
        title: string,
        body: string
    },
    channels: string[]
}>

export type MessageResponse = Readonly<{

}>


export async function sendMessage({ message, channels }: MessageParams, axios: AxiosInstance, signal?: AbortSignal): Promise<MessageResponse> {
    const url = `/messages/firebase`


    const response = await axios.post(url, {
        message,
        channels
    })

    return response.data
}


type PrintReceiptParams = Readonly<{
    orderIds: number[]

}>





export async function printReceipt({ orderIds }: PrintReceiptParams, axios: AxiosInstance, signal?: AbortSignal): Promise<StandardTransactionResultResponse> {
    const url = `/printer/queue`

    const response = await axios.post(url, {
        "orderIds": orderIds

    })

    return response.data
}


type RefundOrderParams = Readonly<{
    orderId: number

}>

export type RefundOrderResponse = Readonly<{

}>



export async function refundOrder({ orderId }: RefundOrderParams, axios: AxiosInstance, signal?: AbortSignal): Promise<RefundOrderResponse> {
    const url = `/printer/queue`

    const response = await axios.delete(url, {
        params: {
            orderId
        },

    })

    return response.data
}


type SetOrderStatusParams = Readonly<{
    orderStatus: OrderStatus
    orderIds: number[]

}>





type DeliveryDetails = {
    time: string;
};

type OrderTransationResult = {
    id: number;
    deliveryDetails: DeliveryDetails;
};

type Status = {
    code: number;
    text: string;
};

export type TransactionResult = {
    order: OrderTransationResult;
    status: Status;
};

export type StandardTransactionResultResponse = Readonly<{
    transactionResults: TransactionResult[]
}>



export async function setOrderStatus({ orderIds, orderStatus }: SetOrderStatusParams, axios: AxiosInstance, signal?: AbortSignal): Promise<StandardTransactionResultResponse> {
    const url = `/orders/batch/status`

    const response = await axios.post(url, {
        orderStatus,
        orderIds

    },)

    return response.data
}

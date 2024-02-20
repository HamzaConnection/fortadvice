import { AxiosInstance } from "axios"
import { ApiCompanyCustomer } from "./customerTypes"

type FetchCustomersParams = Readonly<{
    merchantId: number
    isActive?: boolean
}>

export type FetchCustomersResponse = Readonly<{
    customers: ApiCompanyCustomer[]
}>



export async function fetchCustomersForMerchant({ merchantId, isActive }: FetchCustomersParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchCustomersResponse> {
    const url = `/merchants/${merchantId}/customers`

    const response = await axios.get(url, {
        params: {
            isActive,
        },
        signal
    })

    return response.data
}

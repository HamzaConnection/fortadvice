import { AxiosInstance } from "axios"
import { Merchant } from "../supplier/reporting/merchants/merchantTypes"

type FetchAllMerchantsParams = Readonly<{}>

export type MerchantsResponse = Readonly<{
    merchants: Merchant[]
}>

type FetchAllSuppliersParams = Readonly<{}>

export type SuppliersResponse = Readonly<{
    suppliers: Merchant[]
}>

export async function fetchAllMerchants({}: FetchAllMerchantsParams, axios: AxiosInstance, signal?: AbortSignal): Promise<MerchantsResponse> {
    const response = await axios.get(`/merchants`)
    return response.data
}

export async function fetchAllSuppliers({}: FetchAllSuppliersParams, axios: AxiosInstance, signal?: AbortSignal): Promise<SuppliersResponse> {
    const response = await axios.get(`/suppliers`)
    return response.data
}

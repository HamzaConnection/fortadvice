import { AxiosInstance } from "axios";
import { Merchant } from "./merchantTypes";

type FetchAllMerchantsParams = Readonly<{
    supplierId: number
}>

export type MerchantsResponse = Readonly<{
    merchants: Merchant[]
}>

export async function fetchMerchantsForSupplier({ supplierId }: FetchAllMerchantsParams, axios: AxiosInstance, signal?: AbortSignal): Promise<MerchantsResponse> {
    const response = await axios.get(`/suppliers/${supplierId}/merchants`)
    return response.data
}

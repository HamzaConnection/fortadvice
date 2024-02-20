import { AxiosInstance } from 'axios';

export type ProductGroup = {
    id: number;
    productGroupCode: string;
    name: string;
    isActive: boolean;
    created: string;
    updated: string;
};




type FetchProductGroupsParam = Readonly<{
    merchantId: number
}>


export type FetchProductGroupsResponse = {
    productGroups: ProductGroup[]
}


export async function fetchProductGroups(params: FetchProductGroupsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchProductGroupsResponse> {
    const { merchantId } = params
    const url = `/merchants/${merchantId}/priceLists`

    const response = await axios.get(url, {
        params: {
            merchantId
        },
        signal

    })

    return response.data
}



type DeleteProductGroupParam = Readonly<{
    id: number
    merchantId: number
}>


type DeleteProductGroupResponse = Readonly<{

}>


export async function deleteProductGroup(params: DeleteProductGroupParam, axios: AxiosInstance, signal?: AbortSignal): Promise<DeleteProductGroupResponse> {
    const { id, merchantId } = params
    const url = `merchants/${merchantId}/products`

    const response = await axios.get(url, {
        params: {
            id
        },
        signal

    })

    return response.data
}

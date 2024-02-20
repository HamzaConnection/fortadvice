import { AxiosInstance } from 'axios'
import { BaseMerchantNewsArticle, ExternalMerchantNewsArticle, MerchantProductNewsArticle, NormalMerchantNewsArticle } from './merchantNewsItemType'
import { StrictOmit } from '../../../../lib/lang'




export type FetchMerchantAdminNewsParam = Readonly<{
    merchantId: number
}>


export type FetchMerchantAdminNewsResponse = Readonly<{
    news: BaseMerchantNewsArticle[]
}>


export type CreateMerchantAdminNewsParam = Readonly<{
    merchantId: number
    article: StrictOmit<NormalMerchantNewsArticle, "id" | "created" | "updated"> | StrictOmit<ExternalMerchantNewsArticle, "id" | "created" | "updated"> | StrictOmit<MerchantProductNewsArticle, "id" | "created" | "updated">
}>

export type DeleteMerchantAdminNewsParam = Readonly<{
    merchantId: number
    articleId: number
}>





export async function fetchMerchantAdminNews({ merchantId }: FetchMerchantAdminNewsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchMerchantAdminNewsResponse> {
    const url = `/merchants/${merchantId}/news?draft=true`

    const response = await axios.get(url, {
        params: {
            merchantId
        },
        signal
    })

    return response.data
}


export async function fetchMerchantAdminArchiveNews({ merchantId }: FetchMerchantAdminNewsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchMerchantAdminNewsResponse> {
    const url = `/merchants/:merchantId/news?expired=true&active=false`

    const response = await axios.get(url, {
        params: {
            merchantId
        },
        signal
    })

    return response.data
}



type CreateMerchantAdminNewsResponse = Readonly<{}>

export async function createMerchantAdminNews({ merchantId, article }: CreateMerchantAdminNewsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<CreateMerchantAdminNewsResponse> {
    const response = await axios.post(`/merchants/${merchantId}/news`, {
        body: article,
        signal
    })
    return response.data
}



type DeleteMerchantAdminNewsResponse = Readonly<{}>

export async function deleteMerchantAdminNews({ merchantId, articleId }: DeleteMerchantAdminNewsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<DeleteMerchantAdminNewsResponse> {
    const response = await axios.delete(`/merchants/${merchantId}/news/${articleId}`, {})
    return response.data
}

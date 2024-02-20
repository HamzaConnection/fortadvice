import { AxiosInstance } from 'axios'
import { NewsItem, RoadmapItem } from './newsTypes'

type FetchRoadmapParams = Readonly<{
    startDate?: string
    endDate?: string
}>


export type FetchGoPayNewsResponse = Readonly<{
    news: NewsItem[]
}>

export type FetchRoadmapResponse = Readonly<{
    roadmaps: RoadmapItem[]
}>




export async function fetchGoPayNews({ }, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchGoPayNewsResponse> {
    const url = `/system/news/`

    const response = await axios.get(url, {
        signal
    })

    return response.data
}


export async function fetchRoadmapByPeriod({ startDate, endDate }: FetchRoadmapParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchRoadmapResponse> {
    const url = `/system/roadmap/`


    const response = await axios.get(url, {
        params: {
            startDate,
            endDate
        },
        signal
    })

    return response.data
}

import { AxiosInstance } from 'axios';

export type PriceListType = {
    id: number;
    name: string;
    isActive: boolean;
};


type FetchPriceListsParam = Readonly<{
    merchantId: number
}>


export type FetchPriceListsResponse = {
    priceLists: PriceListType[]
}


export async function fetchPriceLists(params: FetchPriceListsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchPriceListsResponse> {
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




type DetailedPriceList = {
    id: number;
    name: string;
    isActive: boolean;
    messageToCustomers: string;
    internalNote: string;
    priceSetup: {
        currencyCode: string;
        vatCodeId: number;
        priceAdjustment: {
            type: string;
            percentage: {
                amount: number;
                scale: number;
            };
        };
    };
    shops: {
        id: number;
        name: string;
    }[];
    customers: {
        id: number;
        name: string;
    }[];
    history: {
        created: {
            timestamp: string;
            author: string;
        };
        updated: {
            timestamp: string;
            author: string;
        };
    };
};



type FetchDetailedPriceListsParam = Readonly<{
    id: number
}>


export type FetchDetailedPriceListsResponse = {
    priceList: DetailedPriceList
}


export async function fetchDetailedPriceLists(params: FetchDetailedPriceListsParam, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchDetailedPriceListsResponse> {
    const { id } = params
    const url = `/priceLists`

    const response = await axios.get(url, {
        params: {
            id
        },
        signal

    })

    return response.data
}

type DeletePriceListParam = Readonly<{
    id: number
}>


type DeletePriceListResponse = Readonly<{

}>


export async function deletePriceList(params: DeletePriceListParam, axios: AxiosInstance, signal?: AbortSignal): Promise<DeletePriceListResponse> {
    const { id } = params
    const url = `priceLists/`

    const response = await axios.get(url, {
        params: {
            id
        },
        signal

    })

    return response.data
}


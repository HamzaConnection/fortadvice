import { AxiosInstance } from 'axios';

export enum Page {
    PRODUCTION = "PRODUCTION",
    PRODUCTION_ORDERS = "PRODUCTION_ORDERS",
    PRODUCTION_TAKE_AWAY = "PRODUCTION_TAKE_AWAY",
    PURCHASE_CONTROL = "PURCHASE_CONTROL",
    ACCOUNTING_PRODUCT_SALES = "ACCOUNTING_PRODUCT_SALES",
    ACCOUNTING_ORDER = "ACCOUNTING_ORDER",
    ACCOUNTING_SUBSCRIPTION = "ACCOUNTING_SUBSCRIPTION",
    ACCOUNTING_BALANCE = "ACCOUNTING_BALANCE",
    ACCOUNTING_CUSTOMER = "ACCOUNTING_CUSTOMER",
    ACCOUNTING_CUSTOMER_BALANCE = "ACCOUNTING_CUSTOMER_BALANCE",
    MERCHANT_CUSTOMER_ACCESS = "MERCHANT_CUSTOMER_ACCESS",
    SUPPLIER_MERCHANT_ACCESS = "SUPPLIER_MERCHANT_ACCESS",
    TENANT_USERS = "TENANT_USERS",
    TENANT_CREATE_USER = "TENANT_CREATE_USER",
    TENANT_CREATE_OFFICE_MANAGER = "TENANT_CREATE_OFFICE_MANAGER",
    MERCHANT_PRICE_LIST = "MERCHANT_PRICE_LIST",
    MERCHANT_CREATE_PRICE_LIST = "MERCHANT_CREATE_PRICE_LIST",
    MERCHANT_PRODUCT_GROUP = "MERCHANT_PRODUCT_GROUP",
}


export type PageHelpContent = Readonly<{
    pageHelp: {
        title: string;
        text: string;
        helpGuides: {
            title: string;
            url: string;
        }[];
    };
}>;


type FetchPageHelpContentParams = Readonly<{
    page: Page
}>



export async function fetchPageHelpContent({ page }: FetchPageHelpContentParams, axios: AxiosInstance, signal?: AbortSignal): Promise<PageHelpContent> {

    const url = `page/help?page=${page.toUpperCase()}`

    const response = await axios.get(url, {
        signal
    })

    return response.data
}

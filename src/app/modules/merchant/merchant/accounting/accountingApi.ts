import { AxiosInstance } from 'axios'
import { StrictOmit } from '../../../../lib/lang';
import { MonetaryAmount } from '../../../currency/currencyTypes';
import { PaymentMethodType } from '../../../payments/paymentTypes';
import { ReportDetails, ReportSummary } from '../../controlKitchenApi'
import { Order } from '../../controlKitchenTypes';
import { SalesByAccount } from './accountingTypes';



type PaymentMethod = {
    name: string;
    amount: MonetaryAmount
};

type Account = {
    name: string;
    amount: MonetaryAmount;
    numberOfOrders: number;
    paymentMethods?: PaymentMethod[];

};

type Category = {
    name: string;
    accounts: Account[];
    amount: MonetaryAmount
};





export type BalanceReport = Readonly<{
    reportDetails: ReportDetails
    categories: Category[]

}>

type FetchBalanceParams = Readonly<{
    merchantId: number
    shopId: string | undefined
    startDate: string
    endDate: string
    customerId?: string | undefined
    customerGroupId?: string | undefined

}>

export type FetchBalanceResponse = BalanceReport

export async function fetchBalanceByPeriod({ shopId, startDate, endDate, merchantId, customerId, customerGroupId }: FetchBalanceParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchBalanceResponse> {
    const url = `/merchants/${merchantId}/accounting/balance`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
            customerId,
            customerGroupId,
        },
        signal
    })

    return response.data
}




//Subscription ::::::::::::::::::::::::::::::::::::::

type SubscriptionDetails = {
    validFrom: string;
    validTo?: string;
    amount: {
        amount: number;
        scale: number;
        currency: string;
    };
    paymentDetails: {
        method: PaymentMethodType;
        subscriptionId: string
    };
    customer: {
        initials: string;
        employeeId: string;
        displayName: string;
        givenName: string;
        surName: string;
        email: string;
        userGroup: {
            name: string
        }
    };
    order: {
        id: number,
        uid: string,
        orderType: string,
        accountingCustomerParty: {
            name: string
        }
        created: string

    }
};

export type Subscription = {
    id: number;
    name: string;
    subscriptionDetails: SubscriptionDetails;
};





export type SubscriptionReport = Readonly<{
    reportDetails: ReportDetails
    subscriptions: Subscription[]
}>


type FetchSubscriptionParams = Readonly<{
    merchantId: number
    shopId: string | undefined
    startDate: string
    endDate: string
    customerId?: string | undefined
    customerGroupId?: string | undefined

}>

export type FetchSubscriptionResponse = SubscriptionReport

export async function fetchSubscriptionByPeriod({ shopId, startDate, endDate, merchantId, customerId, customerGroupId }: FetchSubscriptionParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchSubscriptionResponse> {
    const url = `/merchants/${merchantId}/accounting/subscriptions`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
            customerId,
            customerGroupId,
        },
        signal
    })

    return response.data
}


// Product sales ::::::::::::::::::::::::::::::::::::::

type ProductSale = {
    id: number;
    name: string;
    code?: string
    numberOfOrders: number;
    amount: MonetaryAmount
};

type ProductGroup = {
    id: string;
    name: string;
    code?: string;
    totalAmount: MonetaryAmount
    productSales: ProductSale[];
};




type FetchProducSalesParams = Readonly<{
    merchantId: number
    shopId: string | undefined
    startDate: string
    endDate: string
    customerId?: string | undefined
    customerGroupId?: string | undefined

}>

export type FetchProducSalesResponse = Readonly<{
    reportDetails: ReportDetails
    reportSummary: ReportSummary
    productGroups: ProductGroup[]

}>

export async function fetchProducSalesByPeriod({ shopId, startDate, endDate, merchantId, customerId, customerGroupId }: FetchProducSalesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchProducSalesResponse> {
    const url = `/merchants/${merchantId}/accounting/productSale`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
            customerId,
            customerGroupId,
        },
        signal
    })

    return response.data
}


//Customer ::::::::::::::::::::::::::::::::::::::

type CustomerCategory = {
    name: string;
    accounts: Account[];
}

type CustomerSale = {
    id: number;
    displayName: string;
    categories: CustomerCategory[]
    amount: MonetaryAmount
};




export type FetchCustomerSalesResponse = Readonly<{
    reportDetails: ReportDetails
    customerSales?: CustomerSale[]

}>


type FetchCustomerSalesParams = Readonly<{
    merchantId: number
    shopId: string | undefined
    startDate: string
    endDate: string
    customerId?: string | undefined
    customerGroupId?: string | undefined

}>

export async function fetchCustomerSalesByPeriod({ shopId, startDate, endDate, merchantId, customerId, customerGroupId }: FetchCustomerSalesParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchCustomerSalesResponse> {
    const url = `/merchants/${merchantId}/accounting/customerSale`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
            customerId,
            customerGroupId,
        },
        signal
    })

    return response.data
}



// New customer endpoint



type GetAccountingCustomerParams = Readonly<{
    merchantId: number
    hasSales?: boolean
    customerId?: string
    customerGroupId?: string
    startDate: string
    endDate: string
}>

export type AccountingCustomer = Readonly<{
    id: number;
    name: string;
    isActive: boolean;
    isOfficeHotel: boolean;
    hasSales?: boolean;
    userGroups?: {
        id: number;
        name: string;
        isActive: boolean;
        hasSales: boolean;
    }[];
}>;



export type GetCustomersResponse = Readonly<{
    customers: AccountingCustomer[]
}>


// Dette kald henter listen af customers(companies) for en merchant, inklusive customer groups(tenants, user groups).Herudover er der for hver kunde og lejer et hasSales flag, som skal bruges til at implementere en filter toggle, så man kan nøjes med at se kunder med salg.
export async function getAccountingCustomers({ merchantId, hasSales, customerId, customerGroupId, startDate, endDate }: GetAccountingCustomerParams, axios: AxiosInstance, signal?: AbortSignal): Promise<GetCustomersResponse> {
    const url = `/merchants/${merchantId}/accounting/customers`

    const response = await axios.get(url, {
        params: {
            hasSales,
            customerId,
            customerGroupId,
            startDate,
            endDate
        },
        signal
    })

    return response.data
}



type GetCustomerSalesByAccountParams = Readonly<{
    merchantId: number
    customerId: number
    shopId?: string | undefined
    startDate: string
    endDate: string
}>


type AccountingReportDetails = {
    startDate: string
    endDate: string
    merchantId: number
    customerId: string
    reportTime: string
    customerGroupId?: string
}

type ReportData = {
    reportDetails: AccountingReportDetails
    salesByAccount: SalesByAccount
}


export type CustomerSalesByAccountResponse = ReportData


// Dette kald henter salg for en bestemt kunde(ikke lejer) fordelt på accounts og products givet et merchantId og customerId.Denne skal du kalde, hvis bruger udvider en kunde, som ikke er en lejer.
export async function getCustomerSalesByAccounts({ merchantId, customerId, shopId, startDate, endDate }: GetCustomerSalesByAccountParams, axios: AxiosInstance, signal?: AbortSignal): Promise<CustomerSalesByAccountResponse> {
    const url = `/merchants/${merchantId}/accounting/customers/${customerId}/salesByAccount`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
        },
        signal
    })

    return response.data
}


///


type GetCustomerGroupSalesByAccountParams = Readonly<{
    merchantId: number
    customerId: number
    customerGroupId: number
    shopId?: string
    startDate: string
    endDate: string
}>

export type CustomerGroupSalesByAccountResponse = ReportData

// Dette kald henter salg for en bestemt kundegruppe(lejer) fordelt på accounts og products givet et merchantId, customerId og customerGroupId.Denne skal du kalde, hvis brugeren udvider en kunde, som er en lejer.
export async function getCustomerGroupSalesByAccounts({ merchantId, customerId, customerGroupId, shopId, startDate, endDate }: GetCustomerGroupSalesByAccountParams, axios: AxiosInstance, signal?: AbortSignal): Promise<CustomerGroupSalesByAccountResponse> {
    const url = `/merchants/${merchantId}/accounting/customers/${customerId}/customerGroups/${customerGroupId}/salesByAccount`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
        },
        signal
    })

    return response.data
}


// Cancel subscription


type CancelSubscriptionParams = Readonly<{
    orderId: number | string | undefined
    ignoreTerms: boolean

}>

type CancelSubscriptionResponse = Readonly<{

    transactionResponse: {
        subject: string
    }

}>


export async function cancelSubscription({ orderId, ignoreTerms }: CancelSubscriptionParams, axios: AxiosInstance, signal?: AbortSignal): Promise<CancelSubscriptionResponse> {
    const url = `/orders/subscriptions/${orderId}/unsubscribe`

    const response = await axios.post(url, {
        ignoreTerms,
    })

    return response.data
}



// accounting orders

type FetchAccountingOrdersParams = Readonly<{
    merchantId: number
    startDate: string
    endDate: string
    shopId?: string
    customerId?: string
    customerGroupId?: string
    isCancelled: boolean
}>

export type FetchAccountingOrdersResponse = Readonly<{
    orders: Order[] | null
}>

export async function fetchAccountingOrdersByPeriod(params: FetchAccountingOrdersParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchAccountingOrdersResponse> {
    const { shopId, startDate, endDate, merchantId, customerId, customerGroupId, isCancelled } = params
    const url = `/merchants/${merchantId}/accounting/orders`

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


// Customer balance

type User = {
    uid: string;
    employeeId: string;
    displayName?: string;
    name: string;
    initials: string;
    email: string;
};

export type UserBalance = {
    user: User;
    totalAmount: MonetaryAmount;
};


type CustomerBalanceReport = Readonly<{
    reportDetails: ReportDetails;
    reportSummary: ReportSummary;
    usersBalance: UserBalance[];
}>;



type FetchCustomerBalanceReportParams = Readonly<{
    merchantId: number
    startDate?: string
    endDate?: string
    shopId?: string
    customerId?: string
    customerGroupId?: string

}>

export type FetchCustomerBalanceReportResponse = CustomerBalanceReport

export async function fetchCustomerBalanceReportByPeriod(params: FetchCustomerBalanceReportParams, axios: AxiosInstance, signal?: AbortSignal): Promise<FetchCustomerBalanceReportResponse> {
    const { shopId, startDate, endDate, merchantId, customerId, customerGroupId } = params
    const url = `/merchants/${merchantId}/accounting/userBalance`

    const response = await axios.get(url, {
        params: {
            startDate,
            endDate,
            shopId,
            customerId,
            customerGroupId,
        },
        signal

    })

    return response.data
}

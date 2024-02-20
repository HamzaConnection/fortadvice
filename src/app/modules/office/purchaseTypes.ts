import { MonetaryAmount } from '../currency/currencyTypes'
import { OrderType } from '../payments/orderTypes'



export type Customer = Readonly<{
    id: number
    givenName: string
    surName: string
    email: string
    displayName: string
    employeedId: string,
    initials: string,
    department: {
        name: string
    }
    userGroup: {
        id: string,
        name: string
    }
}>

export type PaymentDetails = Readonly<{
    method?: PaymentMethodType
    salesChannel: string
}>

export enum PaymentMethodType {
    FREE = "FREE",
    CREDIT_CARD = "CREDIT_CARD",
    ONE_CLICK_PAYMENT = "ONE_CLICK_PAYMENT",
    MOBILE_PAY = "MOBILE_PAY",
    SALARY_REDUCTION = "SALARY_REDUCTION",
    PAYROLL_DEDUCTION = "PAYROLL_DEDUCTION",
    LUNCH_REGISTRATION = "LUNCH_REGISTRATION",
    GOPAY_WALLET = "GOPAY_ACCOUNT",
    INVOICE = "INVOICE",
    SUBSCRIBE_PAYMENT_CARD = "SUBSCRIBE_PAYMENT_CARD",
}

export type OrderLine = Readonly<{
    productId: number
    name: string
    itemPrice: MonetaryAmount
    items: number
    price: MonetaryAmount
}>

export type AccountingCustomerParty = Readonly<{
    name: string,
    vatnumber: number
}>

export type Order = Readonly<{
    id: number
    uid: string
    orderType: OrderType
    amount: MonetaryAmount
    customer?: Customer
    paymentDetails: PaymentDetails
    created: string
    orderLines: OrderLine[]
    accountingCustomerParty: AccountingCustomerParty
    shopChannel: string
}>

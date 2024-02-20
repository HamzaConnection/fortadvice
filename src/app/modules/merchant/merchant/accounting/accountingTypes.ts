import { MonetaryAmount } from "../../../currency/currencyTypes"

type AccountingCustomer = Readonly<{
    type: "customer"
    id: number
    name: string
    isActive: boolean
    hasSales: boolean
}>

export type AccountingCustomerGroup = Readonly<{
    type: "customerGroup"
    id: number
    customerId: number
    name: string
    isActive: boolean
    hasSales: boolean
}>

export type AccountingDebitor = AccountingCustomer | AccountingCustomerGroup

type Product = Readonly<{
    id: number
    name: string
    code: string
    numberOfItems: number
    totalAmount: MonetaryAmount
}>

type Account = Readonly<{
    name: string
    amount: MonetaryAmount
    products?: Product[]
}>

type AccountingCategory = Readonly<{
    name: string
    accounts: Account[]
    amount: MonetaryAmount
}>

export type SalesByAccount = Readonly<{
    categories: AccountingCategory[]
}>

export type DebitorWithSalesByAccount = AccountingDebitor & Readonly<{
    sales: SalesByAccount
}>

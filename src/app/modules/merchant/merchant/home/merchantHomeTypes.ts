import { MonetaryAmount } from "../../../currency/currencyTypes"

export type SalesSummary = Readonly<{
    numberOfOrders: number
    totalAmount: MonetaryAmount
}>

export type ShopSalesSummary = SalesSummary & Readonly<{
    id: number
    name: string
}>

export type CheckinSummary = Readonly<{
    numberOfOrders: number,
    numberOfCheckIns: number,
    noCheckInsPercentage: number,
    checkInsPercentage: number,
}>

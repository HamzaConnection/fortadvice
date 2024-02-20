import { Merchant } from "../supplier/reporting/merchants/merchantTypes"

type BaseContext = Readonly<{
    type: string
    returnUrl: string
}>

type SupplierContext = BaseContext & Readonly<{
    type: "supplier"
    supplier: Merchant
}>

type MerchantContext = BaseContext & Readonly<{
    type: "merchant"
    merchant: Merchant
}>

export type AppContext =
    | SupplierContext
    | MerchantContext

export type ContextState = Readonly<{
    stack: AppContext[]
    active: AppContext | undefined
}>

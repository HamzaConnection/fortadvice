import { objectHas } from "../../lib/lang"

export interface IMonetaryBase {
    readonly amount: number
    readonly scale: number
    readonly currency: string
}

export interface IMonetaryAmount extends IMonetaryBase {
    readonly formatted: string
}

export type ScaledAmount = Readonly<{
    amount: number
    scale: number
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

export interface IPurchaseCard {
    readonly id: number
    readonly type: string
    readonly displayName?: string
    readonly number: string
    readonly hasExpired?: boolean
}

type ImageIconDetails = Readonly<{
    type: "IMAGE_URL"
    url: string
}>
type FontAwesomeIconDetails = Readonly<{
    type: "FONT_AWESOME"
    spec: string
    color?: string
}>
export type IconDetails = ImageIconDetails | FontAwesomeIconDetails

export interface IPaymentMethod {
    value: PaymentMethodType
    translationKey: string
    showSalesConditions: boolean
    oneClickPaymentId?: number
    card?: IPurchaseCard
    icon?: IconDetails
}

export type FlowDetails = Readonly<{
    type: string
    source: string
}>

interface BasePaymentDetails {
    paymentId: string
    paymentOrderId: string
    paymentOrderUid?: string
    orderId: number
    method?: PaymentMethodType
}

interface PaymentGatewayDetails extends BasePaymentDetails {
    paymentWindowUrl: string
}

interface PaymentFlowDetails extends BasePaymentDetails {
    paymentOrderUid: string
    flowDetails: FlowDetails
}

export type PaymentDetails = Readonly<PaymentGatewayDetails | PaymentFlowDetails>

export function isPaymentGatewayDetails(paymentDetails: PaymentDetails): paymentDetails is PaymentGatewayDetails {
    if (objectHas("paymentWindowUrl", paymentDetails)) return true
    return false
}

export function isPaymentFlowDetails(paymentDetails: PaymentDetails): paymentDetails is PaymentFlowDetails {
    if (objectHas("flowDetails", paymentDetails)) {
        if (paymentDetails.paymentOrderUid) return true
    }

    return false
}

// Company purchases always use invoice as payment method
export const COMPANY_PAYMENT_METHOD = PaymentMethodType.INVOICE

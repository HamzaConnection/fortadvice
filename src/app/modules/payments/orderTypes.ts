import { IMonetaryAmount, IPurchaseCard, PaymentMethodType } from "./paymentTypes";

export enum BuyerParty {
    PRIVATE = "PRIVATE",
    COMPANY = "COMPANY",
}

export enum OrderType {
    CATERING = "CATERING",
    LUNCH = "LUNCH",
    TAKE_AWAY = "TAKE_AWAY",
    REFILL_ACCOUNT = "REFILL_ACCOUNT",
    AUTO_REFILL_ACCOUNT = "AUTO_REFILL_ACCOUNT",
    LUNCH_SUBSCRIPTION = "LUNCH_SUBSCRIPTION",
    SUBSCRIBE_PAYMENT_CARD = "SUBSCRIBE_PAYMENT_CARD",
    // ONE_CLICK_PAYMENT = "ONE_CLICK_PAYMENT",
    MEETING = "MEETING",
    REFUND = "REFUND",
}

export enum WebshopType {
    CATERING = "CATERING",
    LUNCH = "LUNCH",
    TAKE_AWAY = "TAKE_AWAY",
    OTHER = "OTHER"
}

export type ProductPaymentDetails = Readonly<{
    method: PaymentMethodType
}>

export interface IOrderLine {
    readonly resource?: {
        readonly id: number
        readonly resourceTypeId: number
        readonly serviceCenterId: number
    }
    readonly id: number
    readonly uid: string
    readonly items: number
    readonly price?: IMonetaryAmount
    readonly name: string
    readonly description: string
    readonly imageUrl: string
    readonly buyerParty?: BuyerParty
    readonly productId?: number
    readonly paymentDetails?: ProductPaymentDetails
}

export interface IOrderDeliveryLocation {
    readonly name: string
}

export interface IOrderDeliveryCancel {
    readonly cancelEnable: boolean
    readonly shortMessage: string
    readonly message: string
}

export interface IOrderDelivery {
    readonly sittings?: number
    readonly deliveryType?: string
    readonly deliveryLocation?: IOrderDeliveryLocation
    readonly deliveryTime?: string
    readonly orderLines: IOrderLine[]
    readonly orderNote?: string
    readonly cancelOrder?: IOrderDeliveryCancel
}

export interface OrderPaymentDetails {
    readonly method?: PaymentMethodType
    readonly card?: IPurchaseCard
    readonly isCaptured: boolean
    readonly isOnlinePayment: boolean
    readonly bankAccountStatement: string
    readonly remoteIp: string
    readonly toBePaidAsPrivate: IMonetaryAmount
    readonly toBePaidAsCompany: IMonetaryAmount
    readonly status?: "PAID" | "UNPAID" | "INVOICED" | "REFUNDED" | "CANCELLED"
}

export interface IAddress {
    readonly streetName: string
    readonly streetNumber: string
    readonly postalCode: string
    readonly city?: string
    readonly country?: string
}

export interface ICanteen extends IAddress {
    readonly id: number
    readonly name: string
    readonly phoneNumber?: string
    readonly email?: string
    readonly satelliteCanteenId?: number
    readonly santeenTypeId?: number
    readonly brandingDetails?: ICanteenBrandingDetails
    readonly vatnumber?: string
    readonly address?: IAddress
    readonly sellerSupplierParty?: Company
    readonly webshop?: Webshop
    readonly webshops?: Webshop[]
}

export interface ICanteenBrandingDetails {
    readonly description?: string
    readonly chefName?: string
    readonly website?: string
    readonly imageUrl?: string
}

export interface Company {
    readonly uid: string
    readonly name: string
}

export interface Webshop {
    readonly id?: number
    readonly uid?: string
    readonly name?: string
    readonly shopNumber?: string
    readonly orderType?: OrderType
    readonly type?: WebshopType
    readonly currencyCode?: string
}
export interface IOrganizer {
    readonly id: number
    readonly uid: string
    readonly initials: string
    readonly firstname: string
    readonly lastname: string
    readonly name: string
    readonly email: string
    readonly businessPhone: string
    readonly mobilePhone: string
    readonly departmentId: number
    readonly department: string
    readonly customerTypeId: number
    readonly usertypeId: number
    readonly organizerType: string
    readonly companyId: number
    readonly orderBaseId: number
}

export interface IUser {
    readonly id: number
    readonly uid: string
    readonly uidHash: string
    readonly username: string
    readonly initials: string
    readonly displayName: string
    readonly givenName: string
    readonly surName: string
    readonly email: string
    readonly phoneNumber: string
    readonly mobileNumber: string
    readonly customerTypeId: number
    readonly accountBalance?: IMonetaryAmount
    readonly isSubscribedToLunch: boolean
    readonly isPrivateAccount?: boolean
    readonly company: Company
}


export interface IOrder {
    readonly id: number
    readonly uid: string
    readonly displayName?: string
    readonly permaLink: string
    readonly created?: string
}

export interface IOrderDetails extends IOrder {
    readonly organizers?: IOrganizer[]
    readonly orderLines?: IOrderLine[]
    readonly paymentDetails?: OrderPaymentDetails
    readonly deliveries?: IOrderDelivery[]
    readonly cancelEnable?: boolean
    readonly kitchen?: ICanteen
    readonly shopChannel?: string
    readonly orderType: OrderType
}

export interface IMyOrderDetails extends IOrderDetails {
    readonly kitchen: ICanteen
    readonly price: IMonetaryAmount
    readonly payment?: { method: PaymentMethodType }
    readonly customer?: IUser
}

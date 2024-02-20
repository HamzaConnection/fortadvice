import { MonetaryAmount } from '../currency/currencyTypes'

export type OrderLine = Readonly<{
    name: string
    items: number
    productId?: number
    itemPrice?: MonetaryAmount
    price?: MonetaryAmount
}>

export type OrderStatus = "RECEIVED" | "CONFIRMED" | "CANCELLED" | "READY" | ""

export type Order = Readonly<{
    id: number
    uid: string
    lineNumber: number
    orderStatus?: OrderStatus
    orderSummary?: {
        numberOfItems: number
    }
    orderLines?: OrderLine[]
    amount: MonetaryAmount
    printDetails?: {
        isPrinted: boolean
    }
    paymentDetails: {
        method?: string
    }
    receipt?: {
        checkIn: {
            isValid: boolean
            checkInTime: string
        },
        control: {
            controlTime: string
            isValid: boolean
            reason: {
                type: string
                value: string
            }
        }
    }
    orderType: string
    permaLink: string
    currencyCode?: string
    created: string
    updated: string
    customer?: {
        id: number
        email: string
        givenName: string
        surName: string
        initials: string
        employeeId: string
        displayName: string
        department: {
            name: string
            number: string
        },
        userGroup?: {
            id?: number
            name?: string
        }
    }

    accountingCustomerParty?: {
        uid: string
        name: string
        phoneNumber: string
        email: string
        streetName: string
        streetNumber: string
        postalCode: string
        city: string
        contactPerson: string
        vatNumber: string
    }
}>

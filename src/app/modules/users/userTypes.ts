import { DateTime } from "luxon"
import { StrictOmit } from "../../lib/lang"
import { UserType } from "../login/loginTypes"

export enum AdminRole {
    agreement_owner = "agreement_owner",
    dpo = "dpo",
    it_administrator = "it_administrator",
    bookkeeper = "bookkeeper",
    news_subscriber = "news_subscriber",
    system_operation_subscriber = "system_operation_subscriber",
}

type HistoryRecord = {
    timestamp: DateTime
    author: string
}

export type History = {
    created: HistoryRecord
    updated?: HistoryRecord
}

export type UserSettings = {
    ignoreUserSyncJobs: boolean
}

type AdminSecuritySettings = {
    allowToCreateAdmins?: boolean
    restrictAccessToIpAddresses?: string
}

export type User = Readonly<{
    id: number
    companyId: number
    customerTypeId: number  // this is actually the user group of the user (employee, consultant, etc) not a user type as such
    uid: string
    username: string

    employeeId?: string
    displayName: string
    email: string
    mobileNumber?: string
    phoneNumber?: string
    department?: {
        id: number
        number: string
        name: string
    }

    isActive: boolean
    isPrivateAccount?: boolean
    isTest: boolean

    settings?: UserSettings
    history?: History
}>

export type CreateUser = StrictOmit<User, "id" | "uid" | "username" | "department" | "isActive" | "isTest" | "settings" | "history"> & Readonly<{
    username?: string
    department?: {
        id: number
    }
    settings?: UserSettings & Readonly<{
        sendEmailInvitation?: boolean
    }>
    isTest?: boolean
}>

export type UpdateUser = StrictOmit<User, "id" | "uid" | "username" | "department" | "isPrivateAccount" | "isTest" | "history"> & Readonly<{
    username?: string
    department?: {
        id: number
    }
}>

type AdminUser = StrictOmit<User, "companyId" | "customerTypeId" | "employeeId" | "phoneNumber" | "department" | "isPrivateAccount" | "isTest" | "settings" | "history">

type CreateAdminUser = StrictOmit<AdminUser, "id" | "uid" | "username" | "isActive"> & Readonly<{
    username?: string
}>

type UpdateAdminUser = StrictOmit<AdminUser, "id" | "uid" | "username"> & Readonly<{
    username?: string
}>

type BaseAdmin = {
    user: AdminUser
    roles?: AdminRole[]
    securitySettings?: AdminSecuritySettings
    history?: History
}

export type TenantOfficeManager = BaseAdmin & Readonly<
    {
        type: UserType.OFFICE_MANAGER
        officeManagerDetails: {
            companyId: number
            userGroupId: number
        }
    }
>

export type CompanyAdmin = BaseAdmin & Readonly<{
    type: UserType.COMPANY
    companyDetails: {
        companyId: number
    }
}>

export type MerchantAdmin = BaseAdmin & Readonly<{
    type: UserType.MERCHANT
    merchantDetails: {
        companyId: number
    }
}>

export type SupplierAdmin = BaseAdmin & Readonly<{
    type: UserType.SUPPLIER
    supplierDetails: {
        companyId: number
    }
}>

export type SupportAdmin = BaseAdmin & Readonly<{
    type: UserType.SUPPORT
}>

export type Admin =
    | TenantOfficeManager
    | CompanyAdmin
    | MerchantAdmin
    | SupplierAdmin
    | SupportAdmin

// NOTE: TypeScript cannot (yet) handle derived types from discriminated unions (discrimination didn't work), so we
// need to recreate the union here, sigh...
type CreateTenantAdmin = StrictOmit<TenantOfficeManager, "user" | "history"> & Readonly<{
    user: CreateAdminUser
}>
type CreateCompanyAdmin = StrictOmit<CompanyAdmin, "user" | "history"> & Readonly<{
    user: CreateAdminUser
}>
type CreateMerchantAdmin = StrictOmit<MerchantAdmin, "user" | "history"> & Readonly<{
    user: CreateAdminUser
}>
type CreateSupplierAdmin = StrictOmit<SupplierAdmin, "user" | "history"> & Readonly<{
    user: CreateAdminUser
}>
type CreateSupportAdmin = StrictOmit<SupportAdmin, "user" | "history"> & Readonly<{
    user: CreateAdminUser
}>
export type CreateAdmin =
    | CreateTenantAdmin
    | CreateCompanyAdmin
    | CreateMerchantAdmin
    | CreateSupplierAdmin
    | CreateSupportAdmin

type UpdateTenantAdmin = StrictOmit<TenantOfficeManager, "user" | "history"> & Readonly<{
    user: UpdateAdminUser
}>
type UpdateCompanyAdmin = StrictOmit<CompanyAdmin, "user" | "history"> & Readonly<{
    user: UpdateAdminUser
}>
type UpdateMerchantAdmin = StrictOmit<MerchantAdmin, "user" | "history"> & Readonly<{
    user: UpdateAdminUser
}>
type UpdateSupplierAdmin = StrictOmit<SupplierAdmin, "user" | "history"> & Readonly<{
    user: UpdateAdminUser
}>
type UpdateSupportAdmin = StrictOmit<SupportAdmin, "user" | "history"> & Readonly<{
    user: UpdateAdminUser
}>
export type UpdateAdmin =
    | UpdateTenantAdmin
    | UpdateCompanyAdmin
    | UpdateMerchantAdmin
    | UpdateSupplierAdmin
    | UpdateSupportAdmin

export function isTenantUser(user: User | Admin): user is User {
    return (user as User).displayName !== undefined
}

export function isAdmin(user: User | Admin): user is Admin {
    return (user as Admin).type !== undefined
}

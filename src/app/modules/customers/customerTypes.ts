export type UserGroup = Readonly<{
    id: number
    name: string
    isActive: boolean
    domains?: string[]
}>

export type ApiCompanyCustomer = Readonly<{
    id: number
    name: string
    isActive: boolean
    isOfficeHotel: boolean
    domains?: string[]
    userGroups?: UserGroup[]
    customerGroups?: UserGroup[]
}>

export type CompanyCustomer = Readonly<{
    type: "company"
    id: number
    name: string
    isActive: boolean
    domains: string[]
}>

export type TenantCustomer = Readonly<{
    type: "tenant"
    id: number
    customerId: number
    name: string
    isActive: boolean
    domains: string[]
}>

export type BusinessCustomer = CompanyCustomer | TenantCustomer


export enum AuthenticationAction {
    REQUIRES_PASSWORD = "REQUIRES_PASSWORD",
    AUTHENTICATION_COMPLETE = "AUTHENTICATION_COMPLETE",
    REQUIRES_ACTIVATION_CODE = "REQUIRES_ACTIVATION_CODE",
    CREATE_PASSWORD = "CREATE_PASSWORD",
}

export enum UserType {
    SYSTEM_OWNER = "SYSTEM_OWNER",
    SUPPORT = "SUPPORT",
    MERCHANT = "MERCHANT",
    COMPANY = "COMPANY",
    DEBTOR = "DEBTOR",
    USER = "USER",
    SERVICE_CENTER = "SERVICE_CENTER",
    SATELLITE_CANTEEN = "SATELLITE_CANTEEN",
    SUPPLIER = "SUPPLIER",
    OFFICE_MANAGER = "OFFICE_MANAGER",
    COMPANY_ADMIN = "COMPANY_ADMIN",
}

export type AuthenticationUser = Readonly<{
    userType: UserType
    id: number
    companyId: number
    userGroupId?: number
    username: string
    displayInitials: string
}>


export type RequiresPasswordResult = Readonly<{
    type: string
    action: AuthenticationAction.REQUIRES_PASSWORD
    message?: string
}>

export type AuthenticationCompleteResult = Readonly<{
    type: string
    action: AuthenticationAction.AUTHENTICATION_COMPLETE,
    message?: string
}>

export type RequiresActivationCodeResult = Readonly<{
    type: string
    action: AuthenticationAction.REQUIRES_ACTIVATION_CODE,
    message?: string
}>

export type CreatePasswordResult = Readonly<{
    type: string
    action: AuthenticationAction.CREATE_PASSWORD,
    message?: string
}>

export type Authentication = Readonly<{
    type: string
    token: string
}>


export type RequiresPasswordResponse = Readonly<{
    authentication: Authentication
    authenticationResult: RequiresPasswordResult
}>


export type RequiresActivationCodeResponse = Readonly<{
    authentication: Authentication
    authenticationResult: RequiresActivationCodeResult
}>

export type RequiresCreatePasswordResponse = Readonly<{
    authentication: Authentication
    authenticationResult: CreatePasswordResult
    user: AuthenticationUser
}>


export function isRequiresPasswordResponse(response: AuthenticationResponse): response is RequiresPasswordResponse {
    return response.authenticationResult.action === AuthenticationAction.REQUIRES_PASSWORD
}

export function isRequiresActivationCodeResponse(response: AuthenticationResponse): response is RequiresPasswordResponse {
    return response.authenticationResult.action === AuthenticationAction.REQUIRES_ACTIVATION_CODE
}

export function isRequiresCreatePasswordResponse(response: AuthenticationResponse): response is RequiresCreatePasswordResponse {
    return response.authenticationResult.action === AuthenticationAction.CREATE_PASSWORD
}

export type AuthenticationCompleteResponse = Readonly<{
    authenticationResult: AuthenticationCompleteResult
    authentication: Authentication
    user: AuthenticationUser
}>

export type ResetPasswordCompleteResponse = Readonly<{
    authenticationResult: AuthenticationCompleteResult
    authentication: Authentication
    user: AuthenticationUser
}>

export function isAuthenticationComplete(response: AuthenticationResponse): response is AuthenticationCompleteResponse {
    return response.authenticationResult.action === AuthenticationAction.AUTHENTICATION_COMPLETE
}

export function isCreatePassword(response: RequiresCreatePasswordResponse): response is RequiresCreatePasswordResponse {
    return response.authenticationResult.action === AuthenticationAction.CREATE_PASSWORD
}


export type AuthenticationResponse =
    | RequiresPasswordResponse
    | AuthenticationCompleteResponse
    | RequiresActivationCodeResponse
    | RequiresCreatePasswordResponse


type ValidatePasswordSupplierRequest = Readonly<{
    userType: UserType.SUPPLIER
    supplierDetails: {
        companyId: number
    }
    password: string
}>
type ValidatePasswordMerchantRequest = Readonly<{
    userType: UserType.MERCHANT
    merchantDetails: {
        companyId: number
    }
    password: string
}>
type ValidatePasswordCompanyRequest = Readonly<{
    userType: UserType.COMPANY
    companyDetails: {
        companyId: number
    }
    password: string
}>
type ValidatePasswordTenantRequest = Readonly<{
    userType: UserType.OFFICE_MANAGER
    officeManagerDetails: {
        companyId: number
        userGroupId: number
    }
    password: string
}>
export type ValidatePasswordRequest =
    | ValidatePasswordSupplierRequest
    | ValidatePasswordMerchantRequest
    | ValidatePasswordCompanyRequest
    | ValidatePasswordTenantRequest

type ValidateSuccessResponse = Readonly<{
    validator: {
        success: true
    }
}>

type ValidateErrorResponse = Readonly<{
    validator: {
        success: false
        rules: string[]
    }
}>

export type ValidatePasswordResponse = ValidateSuccessResponse | ValidateErrorResponse


export enum LoginStatus {
    AUTHENTICATING = "AUTHENTICATING",
    LOGGED_IN = "LOGGED_IN",
}

type AuthenticatingState = Readonly<{
    status: LoginStatus.AUTHENTICATING
    username: string | undefined
    rememberMe: boolean
}>

type LoggedInState = Readonly<{
    status: LoginStatus.LOGGED_IN
    user: AuthenticationUser
    authToken: string
}>

export type LoginState = AuthenticatingState | LoggedInState

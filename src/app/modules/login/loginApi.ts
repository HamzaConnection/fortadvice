import { AxiosInstance } from 'axios'
import { AppError } from '../../core/api/errorTypes'
import { Authentication, AuthenticationResponse, UserType, ValidatePasswordRequest, ValidatePasswordResponse } from './loginTypes'

type AuthenticateByUsernameParams = Readonly<{
    username: string
}>

type ResetPasswordParams = Readonly<{
    email: string
}>

type AuthenticateByActivationCodeParams = Readonly<{
    type: string // Create enum for types
    value: string
}>

type CreatePasswordParams = Readonly<{
    oneTimeToken: string
    password: string
}>

type AuthenticateByPasswordParams = Readonly<{
    username: string
    password: string
    authentication: Authentication
}>

type ActivateAccountParams = Readonly<{
    username: string
    password: string
    authentication: Authentication
}>

export async function authenticateByUsername({ username }: AuthenticateByUsernameParams, axios: AxiosInstance): Promise<AuthenticationResponse> {
    const response = await axios.post("/authenticate/admin/username", {
        username
    })

    return response.data
}

export async function resetPassword({ email }: ResetPasswordParams, axios: AxiosInstance): Promise<AuthenticationResponse> {
    const response = await axios.post("/authenticate/resetPassword", {
        email
    })

    return response.data
}

export async function authenticateByActivationCode({ type, value }: AuthenticateByActivationCodeParams, axios: AxiosInstance): Promise<AuthenticationResponse> {
    const response = await axios.post("/authenticate/byType", {
        type, value
    })

    return response.data
}

export async function createPassword({ oneTimeToken, password }: CreatePasswordParams, axios: AxiosInstance): Promise<AuthenticationResponse> {
    const response = await axios.post("/authenticate/createPassword", {
        oneTimeToken, password
    })

    return response.data
}



export async function authenticateByPassword({ username, password, authentication }: AuthenticateByPasswordParams, axios: AxiosInstance): Promise<AuthenticationResponse> {
    const response = await axios.post("/authenticate", {
        username,
        password,
        authentication
    })

    return response.data
}

type GetValidatePwRequest = Readonly<{
    userType: UserType
    companyId: number
    userGroupId: number | null
    password: string
}>

export function getValidatePwRequest({ userType, companyId, userGroupId, password }: GetValidatePwRequest): ValidatePasswordRequest {
    switch (userType) {
        case UserType.SUPPLIER:
            return {
                userType: UserType.SUPPLIER,
                supplierDetails: {
                    companyId,
                },
                password,
            }
        case UserType.MERCHANT:
            return {
                userType: UserType.MERCHANT,
                merchantDetails: {
                    companyId,
                },
                password,
            }
        case UserType.COMPANY:
            return {
                userType: UserType.COMPANY,
                companyDetails: {
                    companyId,
                },
                password,
            }
        case UserType.OFFICE_MANAGER:
            if (!userGroupId) throw new AppError("Internal Error", `A value for userGroupId must be provided for userType ${userType}`)

            return {
                userType: UserType.OFFICE_MANAGER,
                officeManagerDetails: {
                    companyId,
                    userGroupId,
                },
                password,
            }
        default:
            throw new AppError("Invalid invitation link", `Unsupported userType value: ${userType}`)
    }
}

export async function validatePassword(request: ValidatePasswordRequest, axios: AxiosInstance, signal?: AbortSignal): Promise<ValidatePasswordResponse> {
    const url = "/authenticate/validatePassword"

    const response = await axios.post(url, request, {
        signal,
    })

    return response.data
}

export async function activateAccount(request: ActivateAccountParams, axios: AxiosInstance): Promise<AuthenticationResponse> {
    const response = await axios.post("/authenticate/activateAdminAccount", request)
    return response.data
}

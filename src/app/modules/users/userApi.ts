import { AxiosInstance } from "axios"
import { Admin, CreateAdmin, CreateUser, UpdateAdmin, UpdateUser, User } from "./userTypes"

// --- Create user ---
type CreateUserParams = Readonly<{
    user: CreateUser
}>

type CreateUserResponse = Readonly<{
    user: User
}>

export async function createUser(
    { user }: CreateUserParams,
    axios: AxiosInstance,
    signal?: AbortSignal,
): Promise<CreateUserResponse> {

    const response = await axios.post(`/users`, {
        user,
    }, {
        signal,
    })

    return response.data
}


// --- Update user ---
type UpdateUserParams = Readonly<{
    userId: number
    user: UpdateUser
}>

type UpdateUserResponse = Readonly<{
    user: User
}>

export async function updateUser({ userId, user }: UpdateUserParams, axios: AxiosInstance, signal?: AbortSignal): Promise<UpdateUserResponse> {
    const url = `/users/${userId}`

    const response = await axios.post(url, {
        user,
    }, {
        signal,
    })

    return response.data
}


// --- Delete user ---
type DeleteUserParams = Readonly<{
    userId: number
}>

type DeleteUserResponse = Readonly<{}>

export async function deleteUser(
    { userId }: DeleteUserParams,
    axios: AxiosInstance,
    signal?: AbortSignal,
): Promise<DeleteUserResponse> {
    const url = `/users/${userId}`

    const response = await axios.delete(url, {
        signal,
    })

    if (response.status === 204) return {}

    return response.data
}


// --- Create admin ---
type CreateAdminParams = Readonly<{
    admin: CreateAdmin
}>

type CreateAdminResponse = Readonly<{
    admin: Admin
}>

export async function createAdmin({ admin }: CreateAdminParams, axios: AxiosInstance, signal?: AbortSignal): Promise<CreateAdminResponse> {
    const response = await axios.post(`/administrators`, {
        admin,
    }, {
        signal,
    })

    return response.data
}


// --- Update admin ---
type UpdateAdminParams = Readonly<{
    userId: number
    admin: UpdateAdmin
}>

type UpdateAdminResponse = Readonly<{
    admin: Admin
}>

export async function updateAdmin({ userId, admin }: UpdateAdminParams, axios: AxiosInstance, signal?: AbortSignal): Promise<UpdateAdminResponse> {
    const url = `/administrators/${userId}`

    const response = await axios.post(url, {
        admin,
    }, {
        signal,
    })

    return response.data
}


// --- Delete admin ---
type DeleteAdminParams = Readonly<{
    userId: number
}>

type DeleteAdminResponse = Readonly<{}>

export async function deleteAdmin({ userId }: DeleteAdminParams, axios: AxiosInstance, signal?: AbortSignal): Promise<DeleteAdminResponse> {
    const url = `/administrators/${userId}`

    const response = await axios.delete(url, {
        signal,
    })

    if (response.status === 204) return {}

    return response.data
}

import { AxiosInstance } from "axios"
import { Admin, TenantOfficeManager, User } from "../../users/userTypes"

// Fetch Users
export type FetchTenantUsersResponse = Readonly<{ users: User[] }>

type FetchTenantUsersParams = Readonly<{
    companyId: number
    userGroupId: number
}>

export async function fetchTenantUsers(
    { companyId, userGroupId }: FetchTenantUsersParams,
    axios: AxiosInstance,
    signal?: AbortSignal,
): Promise<FetchTenantUsersResponse> {
    const url = `/companies/${companyId}/userGroups/${userGroupId}/users`

    const response = await axios.get(url, { signal })

    return response.data
}

// -- OFFICE MANAGER API

// Fetch Office Managers
export type FetchTenantAdminsResponse = Readonly<{
    administrators: TenantOfficeManager[]
}>

type FetchTenantAdminParams = FetchTenantUsersParams
export async function fetchTenantAdmins(
    { companyId, userGroupId }: FetchTenantAdminParams,
    axios: AxiosInstance,
    signal?: AbortSignal,
): Promise<FetchTenantAdminsResponse> {
    const url = `/companies/${companyId}/userGroups/${userGroupId}/administrators`

    const response = await axios.get(url, { signal })

    return response.data
}

import { RootState } from "../store/store"
import { LoginStatus } from "./loginTypes"

export function selectLoginStatus({ login }: RootState) {
    return login.status
}

export function selectUsername({ login }: RootState) {
    return login.status === LoginStatus.AUTHENTICATING ? login.username : login.user.username
}

export function selectRememberMe({ login }: RootState) {
    return login.status === LoginStatus.AUTHENTICATING ? login.rememberMe : undefined
}

export function selectAuthToken({ login }: RootState) {
    return login.status === LoginStatus.LOGGED_IN ? login.authToken : undefined
}

export function selectUserType({ login }: RootState) {
    return login.status === LoginStatus.LOGGED_IN ? login.user.userType : undefined
}

export function selectUserInitials({ login }: RootState) {
    return login.status === LoginStatus.LOGGED_IN ? login.user.displayInitials : undefined
}

export function selectUserCompanyId({ login }: RootState) {
    return login.status === LoginStatus.LOGGED_IN ? login.user.companyId : undefined
}

export function selectUserGroupId({ login }: RootState) {
    return login.status === LoginStatus.LOGGED_IN ? login.user.userGroupId : undefined
}

export function selectAuthenticatedUser({ login }: RootState) {
    return login.status === LoginStatus.LOGGED_IN ? login.user : undefined
}

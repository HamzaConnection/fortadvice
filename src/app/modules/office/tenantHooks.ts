import { useAppSelector } from "../store/storeHooks"
import { UserType } from "../login/loginTypes"
import { selectEffectiveCompanyId, selectEffectiveUserGroup, selectEffectiveUserType } from "../context/contextSelectors"
import { AppError } from "../../core/api/errorTypes"

export function useCurrentTenant() {
    const currentUserType = useAppSelector(selectEffectiveUserType)
    const companyId = useAppSelector(selectEffectiveCompanyId)
    const userGroupId = useAppSelector(selectEffectiveUserGroup)

    if (currentUserType !== UserType.OFFICE_MANAGER) {
        throw new AppError("Internal Error", `Must be in tenant context to use this hook [current effective user type: ${currentUserType}]`)
    } else if (companyId === undefined || userGroupId === undefined) {
        throw new AppError("Internal Error", `Must be logged in and have both company id and user group id available to use this hook [companyId: ${companyId}, userGroupId: ${userGroupId}]`)
    }

    return {
        companyId,
        userGroupId,
    }
}

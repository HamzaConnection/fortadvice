import { createSelector } from "@reduxjs/toolkit"
import { UnreachableCaseError } from "../../lib/lang"
import { RootState } from "../store/store"
import { UserType } from "../login/loginTypes"
import { selectUserCompanyId, selectUserGroupId, selectUserType } from "../login/loginSelectors"

export function selectActiveContext({ context }: RootState) {
    return context.active
}

export const selectEffectiveUserType = createSelector(selectActiveContext, selectUserType, (context, userType) => {
    if (!context) return userType

    switch (context.type) {
        case "supplier":
            return UserType.SUPPLIER
        case "merchant":
            return UserType.MERCHANT
        default:
            throw new UnreachableCaseError(context)
    }
})

export const selectEffectiveCompanyId = createSelector(selectActiveContext, selectUserCompanyId, (context, companyId) => {
    if (!context) return companyId

    switch (context.type) {
        case "supplier":
            return context.supplier.id
        case "merchant":
            return context.merchant.id
        default:
            throw new UnreachableCaseError(context)
    }
})

export const selectEffectiveUserGroup = createSelector(selectActiveContext, selectUserGroupId, (_context, userGroupId) => {
    // TODO: Once we have a tenant context, we must take id from there when it is present
    return userGroupId
})

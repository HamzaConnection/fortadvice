import { PropsWithChildren, useEffect, useMemo } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { ACCESS_DENIED_ROUTE } from "../../../constants/routes"
import { StrictOmit } from "../../../lib/lang"
import { useAppSelector } from "../../store/storeHooks"
import { UserType } from '../../login/loginTypes'
import { selectUserType } from "../../login/loginSelectors"
import { AccessDeniedState } from "../pages/AccessDenied"

function isAccessAllowed(actualUserType: UserType | undefined, requiredUserTypes: UserType[]) {
    return (actualUserType && requiredUserTypes.includes(actualUserType))
}

type RequireUserTypeProps = Readonly<PropsWithChildren<{
    userType: UserType | UserType[]
}>>

export function RequireUserType({ userType, children }: RequireUserTypeProps) {
    const requiredUserTypes = useMemo(() => Array.isArray(userType) ? userType : [userType], [userType])
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const actualUserType = useAppSelector(selectUserType)

    useEffect(() => {
        if (!isAccessAllowed(actualUserType, requiredUserTypes)) {
            const state: AccessDeniedState = {
                requiredUserTypes,
                actualUserType,
                path: pathname,
            }
            navigate(ACCESS_DENIED_ROUTE, { state })
        }
    }, [requiredUserTypes, actualUserType])

    // NOTE: Do NOT render outlet if unauthorized!
    if (!isAccessAllowed(actualUserType, requiredUserTypes)) {
        return null
    }

    return (
        <>
            {children}
        </>
    )
}

type RequireUserTypeLayoutProps = StrictOmit<RequireUserTypeProps, "children">

export function RequireUserTypeLayout({ userType }: RequireUserTypeLayoutProps) {
    return (
        <RequireUserType userType={userType}>
            <Outlet />
        </RequireUserType>
    )
}

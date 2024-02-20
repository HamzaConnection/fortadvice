import { useEffect } from "react"
import { useNavigate } from "react-router"
import { ERROR_ROUTE, LOGIN_ROUTE, MERCHANT_ROUTE, OFFICE_MANAGER_ROUTE, SUPPLIER_ROUTE, SUPPORT_ROUTE } from "../../../constants/routes"
import { useAppSelector } from "../../store/storeHooks"
import { LoginStatus, UserType } from "../../login/loginTypes"
import { selectLoginStatus } from "../../login/loginSelectors"
import { ErrorPageState } from "../../../core/router/pages/ErrorPage"
import { selectEffectiveUserType } from "../../context/contextSelectors"

type RootProps = Readonly<{}>

export function Root({ }: RootProps) {
    const navigate = useNavigate()
    const loginStatus = useAppSelector(selectLoginStatus)
    const userType = useAppSelector(selectEffectiveUserType)

    useEffect(() => {
        if (loginStatus === LoginStatus.AUTHENTICATING) {
            navigate(LOGIN_ROUTE)
        } else {
            switch (userType) {
                case UserType.SUPPORT:
                    navigate(SUPPORT_ROUTE)
                    break
                case UserType.SUPPLIER:
                    navigate(SUPPLIER_ROUTE)
                    break
                case UserType.MERCHANT:
                    navigate(MERCHANT_ROUTE)
                    break
                case UserType.OFFICE_MANAGER:
                    navigate(OFFICE_MANAGER_ROUTE)
                    break
                default:
                    const navState: ErrorPageState = {
                        title: "Unknown user type",
                        message: `User type: ${userType}`
                    }
                    navigate(ERROR_ROUTE, { state: navState })
            }
        }
    }, [loginStatus, userType])

    return null
}

import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN_ROUTE } from '../../../constants/routes'
import { useAppSelector } from '../../store/storeHooks'
import { LoginStatus } from '../../login/loginTypes'
import { selectLoginStatus } from '../../login/loginSelectors'

export const Authenticated = ({ children }: PropsWithChildren<{}>) => {
    const navigate = useNavigate()
    const loginStatus = useAppSelector(selectLoginStatus)

    useEffect(() => {
        // Ensure user is logged in
        if (loginStatus === LoginStatus.AUTHENTICATING) {
            navigate(LOGIN_ROUTE)
        }
    }, [loginStatus])

    // NOTE: Do NOT render children if unauthenticated!
    if (loginStatus === LoginStatus.AUTHENTICATING) return null

    return (
        <>
            {children}
        </>
    )
}

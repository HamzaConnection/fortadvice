import { Navigate } from "react-router-dom"
import { SUPPORT_REPORTS_ROUTE } from "../../../constants/routes"

type SupportHomeProps = Readonly<{}>

export function SupportHome({}: SupportHomeProps) {
    return (
        <Navigate to={SUPPORT_REPORTS_ROUTE} />
    )
}

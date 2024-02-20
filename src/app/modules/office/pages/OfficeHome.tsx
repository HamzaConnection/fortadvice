import { useEffect } from "react"
import { useNavigate } from "react-router"
import { PURCHASES_ROUTE, TENANT_REPORTS_ROUTE } from "../../../constants/routes"

type OfficeHomeProps = Readonly<{}>

export function OfficeHome({}: OfficeHomeProps) {
    const navigate = useNavigate()

    // For now we simply redirect to Purchases page
    useEffect(() => navigate(TENANT_REPORTS_ROUTE))

    // TODO: Build a proper home page for Office Manager
    return null
}

import { useNavigate } from 'react-router-dom'
import { MERCHANT_ADMIN_ROUTE, MERCHANT_REPORTS_ROUTE } from '../../../../constants/routes'
import { useEffect } from 'react'

type OfficeHomeProps = Readonly<{}>

export function MerchantHome({ }: OfficeHomeProps) {
    const navigate = useNavigate()

    // For now we simply redirect to Reports page
    useEffect(() => navigate(MERCHANT_REPORTS_ROUTE))

    // TODO: Build a proper home page
    return null
}

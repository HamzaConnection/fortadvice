import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUPPLIER_REPORTS_ROUTE } from '../../../constants/routes'

type SupplierHomeProps = Readonly<{}>

export function SupplierHome({ }: SupplierHomeProps) {
    const navigate = useNavigate()

    // For now we simply redirect to Reports page
    useEffect(() => navigate(SUPPLIER_REPORTS_ROUTE))

    // TODO: Build a proper home page
    return null
}

import { Suspense } from "react"
import { faShop } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeStyles } from "tss-react/mui"
import { useApiQuery } from "../../../../core/api/useApiQuery"
import { QueryErrorBoundary } from "../../../../core/api/components/QueryErrorBoundary"
import { useAppDispatch } from "../../../store/storeHooks"
import { PageHeader } from "../../../../shared/components/pageHeader/PageHeader"
import { Page } from "../../../../shared/components/pageHeader/PageHeaderApi"
import { pushContext } from "../../../context/contextSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { SUPPLIER_REPORTS_ROUTE } from "../../../../constants/routes"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { Merchant } from "../../../supplier/reporting/merchants/merchantTypes"
import { fetchAllSuppliers } from "../../supportApi"
import { MerchantsTable } from "../../../merchants/components/MerchantsTable"
import { mockServerUrl } from "../../../../constants/apiUrl"
import { useAppLocalization } from '../../../localization/components/AppLocalizationProvider'
import { Breadcrumb, BreadcrumbLink, StandardBreadcrumbs } from '../../../../shared/components/links/StandardBreadcrumbs'

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
}))

function SuppliersList() {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const { data } = useApiQuery(fetchAllSuppliers, {
        queryName: "all-suppliers",
        dependencies: {},
        suspense: true,
        useErrorBoundary: true,
        baseURL: mockServerUrl,
    })

    function handleSupplierClick(supplier: Merchant) {
        dispatch(pushContext({
            type: "supplier",
            supplier,
            returnUrl: pathname
        }))

        navigate(SUPPLIER_REPORTS_ROUTE)
    }

    return (
        <MerchantsTable merchants={data?.suppliers} onMerchantClick={handleSupplierClick} />
    )
}

type Props = Readonly<{}>

export function SupportSuppliers({ }: Props) {
    const { classes } = useStyles()
    const { l10n } = useAppLocalization()



    return (
        <div className={classes.page}>

            <PageHeader title={l10n.getString("support-supplier-access-page-header")} page={Page.SUPPLIER_MERCHANT_ACCESS} icon={<FontAwesomeIcon icon={faShop} />}>



            </PageHeader>


            <QueryErrorBoundary>
                <Suspense fallback={(<MerchantsTable />)}>
                    <SuppliersList />
                </Suspense>
            </QueryErrorBoundary>
        </div>
    )
}

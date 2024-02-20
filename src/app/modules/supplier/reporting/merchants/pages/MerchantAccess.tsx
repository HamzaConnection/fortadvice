import { Suspense } from "react"
import { faShop } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeStyles } from "tss-react/mui"
import { useApiQuery } from "../../../../../core/api/useApiQuery"
import { QueryErrorBoundary } from "../../../../../core/api/components/QueryErrorBoundary"
import { useAppDispatch, useAppSelector } from "../../../../store/storeHooks"
import { selectUserCompanyId } from "../../../../login/loginSelectors"
import { PageHeader } from "../../../../../shared/components/pageHeader/PageHeader"
import { Page } from "../../../../../shared/components/pageHeader/PageHeaderApi"
import { Merchant } from "../merchantTypes"
import { fetchMerchantsForSupplier } from "../merchantsApi"
import { pushContext } from "../../../../context/contextSlice"
import { useLocation, useNavigate } from "react-router-dom"
import { MERCHANT_REPORTS_ROUTE } from "../../../../../constants/routes"
import { LocalizedStrict } from "../../../../localization/components/AppLocalized"
import { MerchantsTable } from "../../../../merchants/components/MerchantsTable"
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'

type MerchantAccessProps = Readonly<{}>

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
}))

function MerchantsList() {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const supplierId = useAppSelector(selectUserCompanyId)
    const dispatch = useAppDispatch()

    const { data } = useApiQuery(fetchMerchantsForSupplier, {
        queryName: "merchants-for-supplier",
        dependencies: {
            supplierId: supplierId ?? 0,
        },
        enabled: Boolean(supplierId),
        suspense: true,
        useErrorBoundary: true,
    })

    function handleMerchantClick(merchant: Merchant) {
        dispatch(pushContext({
            type: "merchant",
            merchant,
            returnUrl: pathname
        }))

        navigate(MERCHANT_REPORTS_ROUTE)
    }

    return (
        <MerchantsTable merchants={data?.merchants} onMerchantClick={handleMerchantClick} />
    )
}

export function MerchantAccess({ }: MerchantAccessProps) {
    const { classes } = useStyles()
    const { l10n } = useAppLocalization()


    return (
        <div className={classes.page}>

            <PageHeader title={l10n.getString("supplier-merchant-access-page-header")} page={Page.SUPPLIER_MERCHANT_ACCESS} icon={<FontAwesomeIcon icon={faShop} />}></PageHeader>

            <QueryErrorBoundary>
                <Suspense fallback={(<MerchantsTable />)}>
                    <MerchantsList />
                </Suspense>
            </QueryErrorBoundary>
        </div>
    )
}

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
import { MERCHANT_REPORTS_ROUTE } from "../../../../constants/routes"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { Merchant } from "../../../supplier/reporting/merchants/merchantTypes"
import { fetchAllMerchants } from "../../supportApi"
import { MerchantsTable } from "../../../merchants/components/MerchantsTable"
import { mockServerUrl } from "../../../../constants/apiUrl"
import { useAppLocalization } from '../../../localization/components/AppLocalizationProvider'

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
}))

function MerchantsList() {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { data } = useApiQuery(fetchAllMerchants, {
        queryName: "all-merchants",
        dependencies: {},
        suspense: true,
        useErrorBoundary: true,
        baseURL: mockServerUrl,
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

type Props = Readonly<{}>

export function SupportMerchants({ }: Props) {
    const { classes } = useStyles()
    const { l10n } = useAppLocalization()

    return (
        <div className={classes.page}>

            <PageHeader title={l10n.getString("support-merchant-access-page-header")} page={Page.SUPPLIER_MERCHANT_ACCESS} icon={<FontAwesomeIcon icon={faShop} />}>
            </PageHeader>


            <QueryErrorBoundary>
                <Suspense fallback={(<MerchantsTable />)}>
                    <MerchantsList />
                </Suspense>
            </QueryErrorBoundary>
        </div>
    )
}

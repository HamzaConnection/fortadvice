import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { ACTIVATION_CODE_ROUTE, AUTH_PASSWORD_ROUTE, CONTROL_KITCHEN_ROUTE, CREATE_PASSWORD_ROUTE, FORGOT_PASSWORD_ROUTE, getAsRoute, LOGIN_ROUTE, PURCHASES_ROUTE, OFFICE_MANAGER_ROUTE, MERCHANT_ROUTE, ROOT_ROUTE, ACCESS_DENIED_ROUTE, NEWS_SUB_ROUTE, ERROR_ROUTE, MERCHANT_ADMIN_ROUTE, MERCHANT_NEWS_ROUTE, MERCHANT_CREATE_NEWS_ROUTE, INVITATION_ROUTE, SURVEY_ROUTE, MERCHANT_REPORTS_ROUTE, ROLLUP_GRAPH_EXAMPLE_ROUTE, MERCHANT_PRODUCTION_ROUTE, ACCOUNTING_ROUTE, SUPPLIER_ROUTE, SUPPLIER_REPORTS_ROUTE, SUPPLIER_REPORTS_MERCHANTS_ROUTE, SUPPLIER_NEWS_ROUTE, PROFILE_SUB_ROUTE, SETTINGS_SUB_ROUTE, SUPPORT_ROUTE, SUPPORT_REPORTS_ROUTE, SUPPORT_ADMIN_ROUTE, SUPPORT_REPORTS_MERCHANTS_ROUTE, SUPPORT_REPORTS_SUPPLIERS_ROUTE, MERCHANT_ADMIN_CUSTOMERS_ROUTE, TENANT_ADMIN_ROUTE, TENANT_USERS_ROUTE, TENANT_REPORTS_ROUTE, TENANT_USERS_CREATE_ADMIN_ROUTE, TENANT_USERS_CREATE_USER_ROUTE, MERCHANT_ADMIN_PRICE_LIST_ROUTE, MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE, MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE } from '../../constants/routes'
import { ForgotPassword } from '../../modules/login/pages/ForgotPassword'
import { SignInWithActivationCode } from '../../modules/login/pages/SignInWithActivationCode'
import { CreatePassword } from '../../modules/login/pages/CreatePassword'
import { Authenticated } from '../../modules/security/components/Authenticated'
import { ControlKitchen } from '../../modules/merchant/merchant/pages/ControlKitchen'
import { ErrorPage } from './pages/ErrorPage'
import { OfficeHome } from '../../modules/office/pages/OfficeHome'
import { MerchantReportsHome } from '../../modules/merchant/merchant/home/pages/MerchantReportsHome'
import { Root } from '../../modules/root/pages/Root'
import { AccessDeniedPage } from '../../modules/security/pages/AccessDenied'
import { RequireUserType, RequireUserTypeLayout } from '../../modules/security/components/RequireUserType'
import { NotFoundPage } from './pages/NotFoundPage'
import { Profile } from '../../modules/profil/pages/Profile'
import { Layout } from '../../shared/layouts/Layout'
import { NewsPage } from '../../modules/news/pages/NewsPage'
import { Purchases } from '../../modules/office/pages/Purchases'
import { StartPageLayout } from '../../modules/login/StartPageLayout'
import { SignInWithPassword } from '../../modules/login/pages/SignInWithPassword'
import { SignInWithUserName } from '../../modules/login/pages/SignInWithUserName'
import { UserType } from '../../modules/login/loginTypes'
import { RouteErrorHandler } from '../../shared/components/errors/RouteErrorHandler'
import { CreateOrEditMerchantArticle } from '../../modules/merchant/admin/news/pages/CreateOrEditMerchantArticle'
import { Invitation } from '../../modules/login/pages/Invitation'
import { Settings } from '../../modules/settings/pages/Settings'
import { Survey } from '../../modules/merchant/admin/survey/pages/Survey'
import { MerchantNews } from '../../modules/merchant/admin/news/pages/MerchantNews'
import { MerchantHome } from '../../modules/merchant/merchant/pages/MerchantHome'
import { Production } from '../../modules/merchant/merchant/production/pages/Production'
import { Accounting } from '../../modules/merchant/merchant/accounting/pages/Accounting'
import { SupplierHome } from '../../modules/supplier/pages/SupplierHome'
import { SupplierReportsHome } from '../../modules/supplier/reporting/pages/SupplierReportsHome'
import { MerchantAccess } from '../../modules/supplier/reporting/merchants/pages/MerchantAccess'
import { NavLayout } from '../../shared/layouts/NavLayout'
import { SupplierReportNavItems } from '../../modules/supplier/reporting/components/SupplierReportNavItems'
import { MerchantReportNavItems } from '../../modules/merchant/merchant/components/MerchantReportNavItems'
import { Fragment } from 'react'
import { MerchantAdminNavItems } from '../../modules/merchant/admin/components/MerchantAdminNavItems'
import { SupportHome } from '../../modules/support/pages/SupportHome'
import { SupportReportsHome } from '../../modules/support/reports/pages/SupportReportsHome'
import { SupportAdminHome } from '../../modules/support/admin/pages/SupportAdminHome'
import { SupportMerchants } from '../../modules/support/reports/pages/SupportMerchants'
import { SupportReportNavItems } from '../../modules/support/reports/components/SupportReportNavItems'
import { SupportSuppliers } from '../../modules/support/reports/pages/SupportSuppliers'
import { TenantAdminHome } from '../../modules/office/admin/pages/TenantAdminHome'
import { TenantReportsHome } from '../../modules/office/reports/pages/TenantReportsHome'
import { TenantUsers } from '../../modules/office/admin/pages/TenantUsers'
import { TenantAdminNavItems } from '../../modules/office/admin/components/TenantAdminNavItems'
import { TenantReportNavItems } from '../../modules/office/reports/components/TenantReportNavItems'
import { CustomerAccessPage } from '../../modules/merchant/admin/customers/pages/CustomerAccess'
import { MerchantAdminHomePage } from '../../modules/merchant/admin/pages/MerchantAdminHome'
import { CreateOrEditTenantAdmin } from '../../modules/office/admin/pages/CreateOrEditTenantAdmin'
import { CreateOrEditTenantUser } from '../../modules/office/admin/pages/CreateOrEditTenantUser'
import { PriceList } from '../../modules/merchant/admin/priceList/pages/PriceList'
import { CreatePriceList } from '../../modules/merchant/admin/priceList/pages/CreatePriceList'
import { ProductGroupPage } from '../../modules/merchant/admin/productGroup/pages/ProductGroup'



// Get base from HTML base element in index.html - and thereby %PUBLIC_URL%
// This will adjust all routes for the subfolder the app is deployed to
const baseAttr = document.querySelector("base")?.getAttribute("href") ?? "/"

// NOTE: Need to remove trailing slash if we have a path
const basename = (baseAttr.length > 1 && baseAttr.endsWith("/")) ? baseAttr.substring(0, baseAttr.length - 1) : baseAttr

// We cannot introduce a component for this due to react-router rules
function getCommonRoutes(key: string) {
    return (
        <Fragment key={key}>
            <Route id={`${key}-profile`} path={PROFILE_SUB_ROUTE} element={(<Profile />)} />
            <Route id={`${key}-settings`} path={SETTINGS_SUB_ROUTE} element={(<Settings />)} />
            <Route id={`${key}-news`} path={NEWS_SUB_ROUTE} element={(<NewsPage />)} />
        </Fragment>
    )
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path={ROOT_ROUTE} element={(<Root />)} />

            <Route path={LOGIN_ROUTE} element={(<StartPageLayout />)}>
                <Route
                    index
                    element={<SignInWithUserName />}
                />

                <Route
                    element={<SignInWithPassword />}
                    path={getAsRoute(LOGIN_ROUTE, AUTH_PASSWORD_ROUTE)}
                />

                <Route
                    element={<ForgotPassword />}
                    path={getAsRoute(LOGIN_ROUTE, FORGOT_PASSWORD_ROUTE)}
                />

                <Route
                    element={<SignInWithActivationCode />}
                    path={getAsRoute(LOGIN_ROUTE, ACTIVATION_CODE_ROUTE)}
                />

                <Route
                    element={<CreatePassword />}
                    path={getAsRoute(LOGIN_ROUTE, CREATE_PASSWORD_ROUTE)}
                />
            </Route>

            <Route path={INVITATION_ROUTE} element={<Invitation />} />

            <Route
                element={(
                    <Authenticated>
                        <Layout />
                    </Authenticated>
                )}
                errorElement={<RouteErrorHandler />}
            >
                <Route
                    path={OFFICE_MANAGER_ROUTE}
                    element={(<RequireUserTypeLayout userType={UserType.OFFICE_MANAGER} />)}
                    handle={{ userTypeRoot: true }}
                >
                    <Route index element={(<OfficeHome />)} />

                    <Route path={getAsRoute(OFFICE_MANAGER_ROUTE, TENANT_ADMIN_ROUTE)} element={(<NavLayout> <TenantAdminNavItems /></NavLayout>)} handle={{ environmentRoot: true, isAdmin: true }}>
                        <Route index element={(<TenantAdminHome />)} />
                        <Route path={getAsRoute(TENANT_ADMIN_ROUTE, TENANT_USERS_ROUTE)} element={(<TenantUsers />)} />
                        <Route path={getAsRoute(TENANT_ADMIN_ROUTE, TENANT_USERS_CREATE_USER_ROUTE)} element={(<CreateOrEditTenantUser />)} />
                        <Route path={getAsRoute(TENANT_ADMIN_ROUTE, TENANT_USERS_CREATE_ADMIN_ROUTE)} element={(<CreateOrEditTenantAdmin />)} />
                        {getCommonRoutes("tenant-admin")}
                    </Route>

                    <Route path={getAsRoute(OFFICE_MANAGER_ROUTE, TENANT_REPORTS_ROUTE)} element={(<NavLayout> <TenantReportNavItems /></NavLayout>)} handle={{ environmentRoot: true }}>
                        <Route index element={(<TenantReportsHome />)} />
                        <Route path={getAsRoute(TENANT_REPORTS_ROUTE, PURCHASES_ROUTE)} element={(<Purchases />)} />

                        {getCommonRoutes("office-report")}
                    </Route>
                </Route>

                <Route
                    path={MERCHANT_ROUTE}
                    element={(<RequireUserTypeLayout userType={[UserType.MERCHANT, UserType.SUPPLIER, UserType.SUPPORT]} />)}
                    handle={{ userTypeRoot: true }}
                >
                    <Route index element={(<MerchantHome />)} />

                    <Route path={getAsRoute(MERCHANT_ROUTE, MERCHANT_ADMIN_ROUTE)} element={(<NavLayout><MerchantAdminNavItems /></NavLayout>)} handle={{ environmentRoot: true, isAdmin: true }}>
                        <Route index element={(<MerchantAdminHomePage />)} />
                        <Route path={getAsRoute(MERCHANT_ADMIN_ROUTE, MERCHANT_NEWS_ROUTE)} element={(<MerchantNews />)} />
                        <Route path={getAsRoute(MERCHANT_ADMIN_ROUTE, MERCHANT_CREATE_NEWS_ROUTE)} element={(<CreateOrEditMerchantArticle />)} />
                        <Route path={getAsRoute(MERCHANT_ADMIN_ROUTE, MERCHANT_ADMIN_CUSTOMERS_ROUTE)} element={<CustomerAccessPage />} />
                        <Route path={getAsRoute(MERCHANT_ADMIN_ROUTE, MERCHANT_ADMIN_PRICE_LIST_ROUTE)} element={<PriceList />} />
                        <Route path={getAsRoute(MERCHANT_ADMIN_ROUTE, MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE)} element={<CreatePriceList />} />
                        <Route path={getAsRoute(MERCHANT_ADMIN_ROUTE, MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE)} element={<ProductGroupPage />} />

                        {getCommonRoutes("merchant-admin")}
                    </Route>

                    <Route path={getAsRoute(MERCHANT_ROUTE, MERCHANT_REPORTS_ROUTE)} element={(<NavLayout><MerchantReportNavItems /></NavLayout>)} handle={{ environmentRoot: true }}>
                        <Route index element={(<MerchantReportsHome />)} />
                        <Route path={getAsRoute(MERCHANT_REPORTS_ROUTE, CONTROL_KITCHEN_ROUTE)} element={(<ControlKitchen />)} />
                        <Route path={getAsRoute(MERCHANT_REPORTS_ROUTE, SURVEY_ROUTE)} element={(<Survey />)} />
                        <Route path={getAsRoute(MERCHANT_REPORTS_ROUTE, MERCHANT_PRODUCTION_ROUTE)} element={(<Production />)} />
                        <Route path={getAsRoute(MERCHANT_REPORTS_ROUTE, ACCOUNTING_ROUTE)} element={(<Accounting />)} />

                        {getCommonRoutes("merchant-reports")}
                    </Route>
                </Route>

                <Route path={SUPPLIER_ROUTE} element={(<RequireUserTypeLayout userType={[UserType.SUPPLIER, UserType.SUPPORT]} />)} handle={{ userTypeRoot: true }}>
                    <Route index element={(<SupplierHome />)} />

                    <Route path={getAsRoute(SUPPLIER_ROUTE, SUPPLIER_REPORTS_ROUTE)} element={(<NavLayout><SupplierReportNavItems /></NavLayout>)} handle={{ environmentRoot: true }}>
                        <Route index element={(<SupplierReportsHome />)} />
                        <Route path={getAsRoute(SUPPLIER_REPORTS_ROUTE, SUPPLIER_REPORTS_MERCHANTS_ROUTE)} element={(<MerchantAccess />)} />

                        {getCommonRoutes("supplier-reports")}
                    </Route>
                </Route>

                <Route path={SUPPORT_ROUTE} element={<RequireUserTypeLayout userType={UserType.SUPPORT} />} handle={{ userTypeRoot: true }}>
                    <Route index element={<SupportHome />} />

                    <Route path={getAsRoute(SUPPORT_ROUTE, SUPPORT_REPORTS_ROUTE)} element={<NavLayout><SupportReportNavItems /></NavLayout>} handle={{ environmentRoot: true }}>
                        <Route index element={<SupportReportsHome />} />
                        <Route path={getAsRoute(SUPPORT_REPORTS_ROUTE, SUPPORT_REPORTS_SUPPLIERS_ROUTE)} element={<SupportSuppliers />} />
                        <Route path={getAsRoute(SUPPORT_REPORTS_ROUTE, SUPPORT_REPORTS_MERCHANTS_ROUTE)} element={<SupportMerchants />} />

                        {getCommonRoutes("support-reports")}
                    </Route>

                    <Route path={getAsRoute(SUPPORT_ROUTE, SUPPORT_ADMIN_ROUTE)} element={<NavLayout></NavLayout>} handle={{ environmentRoot: true, isAdmin: true }}>
                        <Route index element={<SupportAdminHome />} />

                        {getCommonRoutes("support-admin")}
                    </Route>
                </Route>
            </Route >

            <Route path={ACCESS_DENIED_ROUTE} element={(<AccessDeniedPage />)} />

            < Route path={ERROR_ROUTE} element={(<ErrorPage />)} />

            < Route path="*" element={(<NotFoundPage />)} />
        </>
    ), {
    basename
})

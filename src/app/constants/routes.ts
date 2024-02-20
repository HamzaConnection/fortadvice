import { Logger } from '../lib/logging'

export const ROOT_ROUTE = "/"


// --- Common sub routes ---
export const ADMIN_SUB_ROUTE = "admin"
export const REPORT_SUB_ROUTE = "reports"
export const PROFILE_SUB_ROUTE = "profile"
export const SETTINGS_SUB_ROUTE = "settings"
export const NEWS_SUB_ROUTE = "gopay-news"


// --- Login ---
export const LOGIN_ROUTE = "/login"
export const AUTH_PASSWORD_ROUTE = `${LOGIN_ROUTE}/password`
export const FORGOT_PASSWORD_ROUTE = `${LOGIN_ROUTE}/forgot-password`
export const ACTIVATION_CODE_ROUTE = `${LOGIN_ROUTE}/activation-code`
export const CREATE_PASSWORD_ROUTE = `${LOGIN_ROUTE}/create-password`
export const INVITATION_ROUTE = `${LOGIN_ROUTE}/invitation`


// --- Office Manager ---

export const OFFICE_MANAGER_ROUTE = "/office"
export const OFFICE_MANAGER_NEWS_ROUTE = `${OFFICE_MANAGER_ROUTE}/${NEWS_SUB_ROUTE}`

//admin
export const TENANT_ADMIN_ROUTE = `${OFFICE_MANAGER_ROUTE}/admin`
export const TENANT_USERS_ROUTE = `${TENANT_ADMIN_ROUTE}/users`
export const TENANT_USERS_CREATE_USER_ROUTE = `${TENANT_USERS_ROUTE}/create-user`
export const TENANT_USERS_CREATE_ADMIN_ROUTE = `${TENANT_USERS_ROUTE}/create-admin`

//reports
export const TENANT_REPORTS_ROUTE = `${OFFICE_MANAGER_ROUTE}/reports`
export const PURCHASES_ROUTE = `${TENANT_REPORTS_ROUTE}/purchases`


// --- Merchant ---

export const MERCHANT_ROUTE = "/merchant"
export const MERCHANT_GOPAY_NEWS_ROUTE = `${MERCHANT_ROUTE}/${NEWS_SUB_ROUTE}`

// Reports
export const MERCHANT_REPORTS_ROUTE = `${MERCHANT_ROUTE}/${REPORT_SUB_ROUTE}`
export const MERCHANT_PRODUCTION_ROUTE = `${MERCHANT_REPORTS_ROUTE}/production`
export const CONTROL_KITCHEN_ROUTE = `${MERCHANT_REPORTS_ROUTE}/control-kitchen`
export const SURVEY_ROUTE = `${MERCHANT_REPORTS_ROUTE}/survey`
export const ACCOUNTING_ROUTE = `${MERCHANT_REPORTS_ROUTE}/accounting`
export const ROLLUP_GRAPH_EXAMPLE_ROUTE = `${MERCHANT_REPORTS_ROUTE}/rollup-graph-example`

// Admin
export const MERCHANT_ADMIN_ROUTE = `${MERCHANT_ROUTE}/${ADMIN_SUB_ROUTE}`
export const MERCHANT_NEWS_ROUTE = `${MERCHANT_ADMIN_ROUTE}/news`
export const MERCHANT_CREATE_NEWS_ROUTE = `${MERCHANT_ADMIN_ROUTE}/news/create`
export const MERCHANT_ADMIN_CUSTOMERS_ROUTE = `${MERCHANT_ADMIN_ROUTE}/customers`

// Shops
export const MERCHANT_ADMIN_SHOPS_ROUTE = `${MERCHANT_ADMIN_ROUTE}/shops`
export const MERCHANT_ADMIN_PRODUCTS_ROUTE = `${MERCHANT_ADMIN_SHOPS_ROUTE}/products`
export const MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE = `${MERCHANT_ADMIN_SHOPS_ROUTE}/product-groups`
export const MERCHANT_ADMIN_PRICE_LIST_ROUTE = `${MERCHANT_ADMIN_SHOPS_ROUTE}/price-list`
export const MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE = `${MERCHANT_ADMIN_PRICE_LIST_ROUTE}/create`




// --- Supplier ---

export const SUPPLIER_ROUTE = "/supplier"
export const SUPPLIER_NEWS_ROUTE = `${SUPPLIER_ROUTE}/${NEWS_SUB_ROUTE}`

// Reports
export const SUPPLIER_REPORTS_ROUTE = `${SUPPLIER_ROUTE}/${REPORT_SUB_ROUTE}`
export const SUPPLIER_REPORTS_MERCHANTS_ROUTE = `${SUPPLIER_REPORTS_ROUTE}/merchants`

// Admin
export const SUPPLIER_ADMIN_ROUTE = `${SUPPLIER_ROUTE}/${ADMIN_SUB_ROUTE}`



// --- Support ---

export const SUPPORT_ROUTE = "/support"

// Reports
export const SUPPORT_REPORTS_ROUTE = `${SUPPORT_ROUTE}/${REPORT_SUB_ROUTE}`
export const SUPPORT_REPORTS_SUPPLIERS_ROUTE = `${SUPPORT_REPORTS_ROUTE}/suppliers`
export const SUPPORT_REPORTS_MERCHANTS_ROUTE = `${SUPPORT_REPORTS_ROUTE}/merchants`

// Admin
export const SUPPORT_ADMIN_ROUTE = `${SUPPORT_ROUTE}/${ADMIN_SUB_ROUTE}`



// --- Common ---
export const ERROR_ROUTE = "/error"
export const ACCESS_DENIED_ROUTE = "/access-denied"


// Removes the prefix from the entire route
export function getAsRoute(prefix: string, route: string) {
    const logger = new Logger("router")
    const subRoute = route.substring(prefix.length + 1)
    logger.info(`Placing sub route ${subRoute} with prefix ${prefix} at: ${route}`)
    return subRoute
}

export function getReportRoute(prefix: string | undefined) {
    return `${prefix ?? ""}/${REPORT_SUB_ROUTE}`
}

export function getAdminRoute(prefix: string | undefined) {
    return `${prefix ?? ""}/${ADMIN_SUB_ROUTE}`
}

export function getProfileRoute(prefix: string | undefined) {
    return `${prefix ?? ""}/${PROFILE_SUB_ROUTE}`
}

export function getSettingsRoute(prefix: string | undefined) {
    return `${prefix ?? ""}/${SETTINGS_SUB_ROUTE}`
}

export function getGoPayNewsRoute(prefix: string | undefined) {
    return `${prefix ?? ""}/${NEWS_SUB_ROUTE}`
}

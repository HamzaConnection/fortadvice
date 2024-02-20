import { faHome, faReceipt } from "@fortawesome/pro-light-svg-icons"
import { NavMenuItem } from "../../../../shared/layouts/components/NavMenuItem"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { PURCHASES_ROUTE, TENANT_REPORTS_ROUTE } from "../../../../constants/routes"

export function TenantReportNavItems() {
    return (
        <>
            <LocalizedStrict id="nav-menu-home">
                <NavMenuItem icon={faHome} dest={TENANT_REPORTS_ROUTE}>
                    Home
                </NavMenuItem>
            </LocalizedStrict>
            <LocalizedStrict id="nav-menu-office-purchases">
                <NavMenuItem icon={faReceipt} dest={PURCHASES_ROUTE}>
                    Purchases
                </NavMenuItem>
            </LocalizedStrict>
        </>
    )
}

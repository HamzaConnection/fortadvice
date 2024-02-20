import { faHome, faShop } from "@fortawesome/pro-light-svg-icons"
import { SUPPORT_REPORTS_MERCHANTS_ROUTE, SUPPORT_REPORTS_ROUTE, SUPPORT_REPORTS_SUPPLIERS_ROUTE } from "../../../../constants/routes"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { NavMenuItem } from "../../../../shared/layouts/components/NavMenuItem"

export function SupportReportNavItems() {
    return (
        <>
            <LocalizedStrict id="nav-menu-home">
                <NavMenuItem icon={faHome} dest={SUPPORT_REPORTS_ROUTE}>Home</NavMenuItem>
            </LocalizedStrict>
            <LocalizedStrict id="support-nav-item-supplier-access">
                <NavMenuItem icon={faShop} dest={SUPPORT_REPORTS_SUPPLIERS_ROUTE}>Suppliers</NavMenuItem>
            </LocalizedStrict>
            <LocalizedStrict id="support-nav-item-merchant-access">
                <NavMenuItem icon={faShop} dest={SUPPORT_REPORTS_MERCHANTS_ROUTE}>Merchants</NavMenuItem>
            </LocalizedStrict>
        </>
    )
}

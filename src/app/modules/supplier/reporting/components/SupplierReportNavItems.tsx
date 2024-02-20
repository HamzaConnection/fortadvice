import { faHome, faShop } from "@fortawesome/pro-light-svg-icons"
import { SUPPLIER_REPORTS_MERCHANTS_ROUTE, SUPPLIER_REPORTS_ROUTE } from "../../../../constants/routes"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { NavMenuItem } from "../../../../shared/layouts/components/NavMenuItem"

export function SupplierReportNavItems() {
    return (
        <>
            <LocalizedStrict id="nav-menu-home">
                <NavMenuItem icon={faHome} dest={SUPPLIER_REPORTS_ROUTE}>Home</NavMenuItem>
            </LocalizedStrict>
            <LocalizedStrict id="nav-menu-merchant-access">
                <NavMenuItem icon={faShop} dest={SUPPLIER_REPORTS_MERCHANTS_ROUTE}>Merchant Access</NavMenuItem>
            </LocalizedStrict>
        </>
    )
}

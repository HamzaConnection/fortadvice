import { ACCOUNTING_ROUTE, CONTROL_KITCHEN_ROUTE, MERCHANT_PRODUCTION_ROUTE, MERCHANT_REPORTS_ROUTE, SURVEY_ROUTE } from "../../../../constants/routes"
import { faHome, faFileContract, faBagShopping ,faCalendar, faShieldCheck, faFaceSmile, faFileInvoiceDollar, faPaperPlane } from "@fortawesome/pro-light-svg-icons"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { NavMenuItem } from "../../../../shared/layouts/components/NavMenuItem"
import { MatchEnvironment } from "../../../environment/components/MatchEnvironment"
import { EnvironmentType } from "../../../environment/envTypes"

type Props = Readonly<{}>

export function MerchantReportNavItems({}: Props) {
    return (
        <>
            <LocalizedStrict id="nav-menu-home">
                <NavMenuItem icon={faHome} dest={MERCHANT_REPORTS_ROUTE}>Home</NavMenuItem>
            </LocalizedStrict>

            <LocalizedStrict id="nav-menu-production">
                <NavMenuItem icon={faFileContract} dest={MERCHANT_PRODUCTION_ROUTE}>Production</NavMenuItem>
            </LocalizedStrict>

            <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                <NavMenuItem icon={faBagShopping} dest="TODO">Takeaway</NavMenuItem>
            </MatchEnvironment>

            <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                <NavMenuItem icon={faCalendar} dest="TODO">Menu Planning</NavMenuItem>
            </MatchEnvironment>

            <LocalizedStrict id="nav-menu-merchant-menu-item-purchase-control">
                <NavMenuItem icon={faShieldCheck} dest={CONTROL_KITCHEN_ROUTE}>Purchase Control</NavMenuItem>
            </LocalizedStrict>

            <LocalizedStrict id="nav-menu-survey">
                <NavMenuItem icon={faFaceSmile} dest={SURVEY_ROUTE}>Survey</NavMenuItem>
            </LocalizedStrict>

            <LocalizedStrict id="nav-menu-accounting">
                <NavMenuItem icon={faFileInvoiceDollar} dest={ACCOUNTING_ROUTE}>Accounting</NavMenuItem>
            </LocalizedStrict>

            <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                <NavMenuItem icon={faPaperPlane} dest="TODO">Message</NavMenuItem>
            </MatchEnvironment>
        </>
    )
}

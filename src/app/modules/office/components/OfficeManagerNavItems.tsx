import { PURCHASES_ROUTE } from "../../../constants/routes"
import { faReceipt } from "@fortawesome/pro-light-svg-icons"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { NavMenuItem } from "../../../shared/layouts/components/NavMenuItem"

type Props = Readonly<{}>

export function OfficeManagerNavItems({ }: Props) {
    return (
        <>
            <LocalizedStrict id="tenant-nav-item-purchases">
                <NavMenuItem icon={faReceipt} dest={PURCHASES_ROUTE}>Purchases</NavMenuItem>
            </LocalizedStrict>
        </>
    )
}

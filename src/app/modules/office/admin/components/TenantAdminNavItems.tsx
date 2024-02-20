import { faHome, faUser } from "@fortawesome/pro-light-svg-icons"
import { TENANT_ADMIN_ROUTE, TENANT_USERS_ROUTE } from "../../../../constants/routes"
import { NavMenuItem } from "../../../../shared/layouts/components/NavMenuItem"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { MatchEnvironment } from "../../../environment/components/MatchEnvironment"
import { EnvironmentType } from "../../../environment/envTypes"

type Props = Readonly<{}>

export function TenantAdminNavItems() {
    return (
        <>
            <LocalizedStrict id="nav-menu-home">
                <NavMenuItem icon={faHome} dest={TENANT_ADMIN_ROUTE}>
                    Home
                </NavMenuItem>
            </LocalizedStrict>
            <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test, EnvironmentType.Demo]}>
                <LocalizedStrict id="nav-menu-office-users">
                    <NavMenuItem icon={faUser} dest={TENANT_USERS_ROUTE}>
                        Users
                    </NavMenuItem>
                </LocalizedStrict>
            </MatchEnvironment>
        </>
    )
}


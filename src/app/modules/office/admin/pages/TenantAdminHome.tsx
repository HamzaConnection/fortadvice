import { useNavigate } from "react-router-dom"
import { Box } from "@mui/system"
import { Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import {
    TENANT_USERS_CREATE_ADMIN_ROUTE,
    TENANT_USERS_CREATE_USER_ROUTE,
    TENANT_USERS_ROUTE,
} from "../../../../constants/routes"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { AdminHomeCardGroup, AdminHomeCardGroups } from "../../../admin/components/AdminHomeCard"
import { TenantHomeCard } from "../components/TenantHomeCard"
import { MatchEnvironment } from "../../../environment/components/MatchEnvironment"
import { EnvironmentType } from "../../../environment/envTypes"

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
}))

enum OfficeUsers {
    user = "user",
    admin = "admin",
}
type UserType = keyof typeof OfficeUsers

const defaultLocalizationStrings = {
    [OfficeUsers.user]: {
        title: "Users",
        description: "Manage users for your tenant",
    },
    [OfficeUsers.admin]: {
        title: "Administrators",
        description: "Manage administrators",
    },
}

export function TenantAdminHome() {
    const { classes, cx } = useStyles()
    const navigate = useNavigate()

    function handleCreateNewClick(userType: UserType) {
        return () => {
            if (userType === "user") {
                navigate(TENANT_USERS_CREATE_USER_ROUTE)
                return
            }

            navigate(TENANT_USERS_CREATE_ADMIN_ROUTE)
        }
    }

    function handleShowAllClick(userType: UserType) {
        const getRouteToTab = (route: string, tabName: UserType) => `${route}?tab=${tabName}`

        return () => {
            navigate(getRouteToTab(TENANT_USERS_ROUTE, userType))
        }
    }
    return (
        <div className={classes.page}>
            <AdminHomeCardGroups>
                <LocalizedStrict id="office-manager-home-user-card-group" attrs={{ title: true }}>
                    <AdminHomeCardGroup title="Users">
                        <MatchEnvironment environments={[EnvironmentType.QA, EnvironmentType.Prod]}>
                            <LocalizedStrict id="office-manager-home-user-admin-placeholder">
                                <Typography variant="h6" fontStyle="italic" color="text.secondary" align="center">
                                    Coming soon. Here you will be able to manage your users and office managers.
                                </Typography>
                            </LocalizedStrict>
                        </MatchEnvironment>
                        <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test, EnvironmentType.Demo]}>
                            {Object.values(OfficeUsers).map((user) => {
                                const localizationId = `office-manager-home-${user}-card`
                                return (
                                    <LocalizedStrict
                                        id={localizationId as any}
                                        attrs={{
                                            title: true,
                                            description: true,
                                        }}
                                    >
                                        <TenantHomeCard
                                            title={defaultLocalizationStrings[user].title}
                                            description={defaultLocalizationStrings[user].description}
                                            onCreateClick={handleCreateNewClick(user)}
                                            onShowAllClick={handleShowAllClick(user)}
                                        />
                                    </LocalizedStrict>
                                )
                            })}
                        </MatchEnvironment>
                    </AdminHomeCardGroup>
                </LocalizedStrict>
            </AdminHomeCardGroups>
        </div>
    )
}

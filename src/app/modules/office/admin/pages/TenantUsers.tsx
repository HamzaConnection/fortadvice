import React, { useEffect, useState } from "react"
import { makeStyles } from "tss-react/mui"
import { PageHeader } from "../../../../shared/components/pageHeader/PageHeader"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons"
import { Page } from "../../../../shared/components/pageHeader/PageHeaderApi"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { Tab, Tabs } from "@mui/material"
import { TabPanel } from "../../../../shared/components/tabs/tabPanel"
import { TenantUsersTab } from "../components/TenantUsersTab"
import { Box } from "@mui/system"
import { TenantAdminsTab } from "../components/TenantAdminsTab"
import { useLocationQuery } from "../../../../core/router/routerHooks"

const useStyles = makeStyles()((theme) => ({
    page: {
        paddingTop: "3rem",
    },
    customerTable: {
        marginTop: "3rem",
    },
    singleCell: {
        verticalAlign: "baseline",
    },
}))

const tabIndex = {
    user: 0,
    admin: 1,
}

export function TenantUsers() {
    const { classes } = useStyles()

    const query = useLocationQuery()
    const tab = query.get("tab")

    const [activeTab, setActiveTab] = useState(0)
    function handleTabChange(event: React.SyntheticEvent, newActiveTab: number) {
        setActiveTab(newActiveTab)
    }

    useEffect(() => {
        if (tab === "user" || tab === "admin") {
            setActiveTab(tabIndex[tab])
        }
    }, [])

    const { l10n } = useAppLocalization()

    return (
        <div className={classes.page}>

            <PageHeader title={l10n.getString("office-manager-users-page-title")} page={Page.TENANT_USERS} icon={<FontAwesomeIcon icon={faInfoCircle} />}>
            </PageHeader>


            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab
                        value={tabIndex.user}
                        label={l10n.getString("office-manager-users-tab-users")}
                        wrapped
                        sx={{ textTransform: "none" }}
                    />
                    <Tab
                        value={tabIndex.admin}
                        label={l10n.getString("office-manager-users-tab-admins")}
                        wrapped
                        sx={{ textTransform: "none" }}
                    />
                </Tabs>
            </Box>
            <TabPanel value={activeTab} index={tabIndex.user}>
                <TenantUsersTab />
            </TabPanel>
            <TabPanel value={activeTab} index={tabIndex.admin}>
                <TenantAdminsTab />
            </TabPanel>
        </div>
    )
}

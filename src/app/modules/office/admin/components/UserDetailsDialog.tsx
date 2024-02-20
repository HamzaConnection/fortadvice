import { Grid, IconButton, Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { Box } from "@mui/system"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { StandardDialog } from "../../../../shared/components/dialogs/StandardDialog"
import { Admin, User, isAdmin, isTenantUser } from "../../../users/userTypes"
import { useDateTime } from "../../../localization/useDateTime"
import { Close } from "@mui/icons-material"

type UserDetailsDialogProps = Readonly<{
    open: boolean
    onClose: () => void
    user: User | Admin
    title?: string
}>

const useStyles = makeStyles()((theme) => ({
    dialogTopbar: {
        padding: "3rem",
    },
    dialogTitle: {
        color: "#3D3D3D",
    },
    card: {
        position: "relative",
        border: "none",
        padding: theme.spacing(5),
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E2E8F0",
        background: "#F8FAFC",
        boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: 0.25,
        color: "#334155",
        marginBottom: theme.spacing(2),
    },
    text: {
        fontSize: 20,
        letterSpacing: 0.14,
        lineHeight: 1,
        color: "#334155",
    },
    container: {
        padding: "0 3rem 3rem 3rem",
    },
}))

export function UserDetailsDialog({ open, onClose, user, title }: UserDetailsDialogProps) {
    const { classes } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()

    return (
        <StandardDialog
            topbar={(
                <Grid container justifyContent="space-between" className={classes.dialogTopbar}>
                    <Typography variant="h3" className={classes.dialogTitle}>
                        {title !== undefined ? title : l10n.getString("office-manager-user-details-dialog-title")}
                    </Typography>
                    <IconButton edge="end" size="large" onClick={onClose}>
                        <Close fontSize="inherit" />
                    </IconButton>
                </Grid>
            )}
            open={open}
            onClose={onClose}
            maxWidthProp="md"
            scroll="body"
        >
            <Grid container gap={4} className={classes.container}>
                <Grid container alignItems="center" direction="column" wrap="nowrap" gap={4} className={classes.card}>
                    <Grid container item justifyContent="space-between">
                        <LocalizedStrict id="user-details-user-id">
                            <Typography className={classes.text} variant="body2">
                                User id:
                            </Typography>
                        </LocalizedStrict>
                        <Typography className={classes.text} variant="body2">
                            {isAdmin(user) ? user.user.id : user.id}
                        </Typography>
                    </Grid>
                    {isTenantUser(user) && (
                        <Grid container item justifyContent="space-between">
                            <LocalizedStrict id="user-details-employee-id">
                                <Typography className={classes.text} variant="body2">
                                    Employee id:
                                </Typography>
                            </LocalizedStrict>
                            <Typography className={classes.text} variant="body2">
                                {user?.employeeId ?? "-"}
                            </Typography>
                        </Grid>
                    )}
                    <Grid container item justifyContent="space-between">
                        <LocalizedStrict id="user-details-name">
                            <Typography className={classes.text} variant="body2">
                                Name:
                            </Typography>
                        </LocalizedStrict>
                        <Typography className={classes.text} variant="body2">
                            {isAdmin(user) ? user.user.displayName : user.displayName}
                        </Typography>
                    </Grid>
                    <Grid container item justifyContent="space-between">
                        <LocalizedStrict id="user-details-email">
                            <Typography className={classes.text} variant="body2">
                                Email:
                            </Typography>
                        </LocalizedStrict>
                        <Typography className={classes.text} variant="body2">
                            {isAdmin(user) ? user.user.email : user.email}
                        </Typography>
                    </Grid>
                    <Grid container item justifyContent="space-between">
                        <LocalizedStrict id="user-details-mobile">
                            <Typography className={classes.text} variant="body2">
                                Mobile:
                            </Typography>
                        </LocalizedStrict>
                        <Typography className={classes.text} variant="body2">
                            {isAdmin(user) ? user.user.mobileNumber : user.mobileNumber ?? "-"}
                        </Typography>
                    </Grid>
                    {isTenantUser(user) && (
                        <Grid container item justifyContent="space-between">
                            <LocalizedStrict id="user-details-phone">
                                <Typography className={classes.text} variant="body2">
                                    Phone:
                                </Typography>
                            </LocalizedStrict>
                            <Typography className={classes.text} variant="body2">
                                {user?.phoneNumber ?? "-"}
                            </Typography>
                        </Grid>
                    )}
                </Grid>

                {isTenantUser(user) && (
                    <Grid container alignItems="center" direction="column" wrap="nowrap">
                        <Grid item>
                            <LocalizedStrict id="user-details-settings-title">
                                <Typography variant="h4" className={classes.subtitle}>
                                    Settings
                                </Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid container item className={classes.card}>
                            <Grid container item justifyContent="space-between">
                                <LocalizedStrict id="user-details-sync-jobs">
                                    <Typography className={classes.text} variant="body2">
                                        Disconnect sync jobs:
                                    </Typography>
                                </LocalizedStrict>
                                <LocalizedStrict id={user.settings?.ignoreUserSyncJobs ? "user-details-sync-jobs-ignored" : "user-details-sync-jobs-included"}>
                                    <Typography className={classes.text} variant="body2">
                                        {user?.settings?.ignoreUserSyncJobs ? "YES" : "NO"}
                                    </Typography>
                                </LocalizedStrict>
                            </Grid>
                        </Grid>
                    </Grid>
                )}

                {isAdmin(user) && user.securitySettings && (
                    <Grid container alignItems="center" direction="column" wrap="nowrap">
                        <Grid item>
                            <LocalizedStrict id="user-details-security-settings-title">
                                <Typography variant="h4" className={classes.subtitle}>
                                    Security settings
                                </Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid container item className={classes.card}>
                            {user?.securitySettings?.allowToCreateAdmins && (
                                <Grid container item justifyContent="space-between">
                                    <LocalizedStrict id="user-details-security-manage-others">
                                        <Typography className={classes.text} variant="body2">
                                            Can manage other admins:
                                        </Typography>
                                    </LocalizedStrict>
                                    <Typography className={classes.text} variant="body2">
                                        {user?.securitySettings?.allowToCreateAdmins ? "YES" : "NO"}
                                    </Typography>
                                </Grid>
                            )}

                            {user?.securitySettings?.restrictAccessToIpAddresses && (
                                <Grid container item justifyContent="space-between">
                                    <LocalizedStrict id="user-details-security-ip-address">
                                        <Typography className={classes.text} variant="body2">
                                            Whitelist IP address:
                                        </Typography>
                                    </LocalizedStrict>
                                    <Typography className={classes.text} variant="body2">
                                        {user?.securitySettings?.restrictAccessToIpAddresses}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )}

                {user.history && (
                    <Grid container alignItems="center" direction="column" wrap="nowrap">
                        <Grid item>
                            <LocalizedStrict id="user-details-history-title">
                                <Typography variant="h4" className={classes.subtitle}>
                                    Settings
                                </Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid container item className={classes.card}>
                            <Grid container item justifyContent="space-between">
                                <LocalizedStrict id="user-details-history-created">
                                    <Typography className={classes.text} variant="body2">
                                        Created:
                                    </Typography>
                                </LocalizedStrict>
                                <Box>
                                    <Typography className={classes.text} variant="body2">
                                        {dateTimeFactory.formatDate(user?.history?.created?.timestamp)}
                                    </Typography>
                                    <Typography className={classes.text} variant="body2" fontWeight="bold">
                                        {user?.history?.created?.author}
                                    </Typography>
                                </Box>
                            </Grid>
                            {user?.history?.updated && (
                                <Grid container item justifyContent="space-between">
                                    <LocalizedStrict id="user-details-history-edited">
                                        <Typography className={classes.text} variant="body2">
                                            Edited:
                                        </Typography>
                                    </LocalizedStrict>
                                    <Box>
                                        <Typography className={classes.text} variant="body2">
                                            {dateTimeFactory.formatDate(user?.history?.updated?.timestamp)}
                                        </Typography>
                                        <Typography className={classes.text} variant="body2" fontWeight="bold">
                                            {user?.history?.updated?.author}
                                        </Typography>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </StandardDialog>
    )
}

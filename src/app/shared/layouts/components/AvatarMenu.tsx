import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, Divider, Grid, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { Logout, Person, Settings } from '@mui/icons-material'
import { LOGIN_ROUTE, getProfileRoute, getSettingsRoute } from '../../../constants/routes'
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized'
import { MatchEnvironment } from '../../../modules/environment/components/MatchEnvironment'
import { EnvironmentType } from '../../../modules/environment/envTypes'
import { useAppDispatch, useAppSelector } from '../../../modules/store/storeHooks'
import { logout } from '../../../modules/login/loginSlice'
import { selectUserInitials, selectUsername } from '../../../modules/login/loginSelectors'
import { makeStyles } from 'tss-react/mui'
import { Box } from '@mui/system'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/sharp-regular-svg-icons'

type AvatarMenuProps = Readonly<{
    urlPrefix: string | undefined
}>

export function AvatarMenu({ urlPrefix }: AvatarMenuProps) {
    const navigate = useNavigate()

    const { l10n } = useAppLocalization()
    const userInitials = useAppSelector(selectUserInitials)
    const username = useAppSelector(selectUsername)
    const dispatch = useAppDispatch()

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const navigateToProfilePage = () => {
        navigate(getProfileRoute(urlPrefix))
        handleCloseUserMenu()
    }

    function navigateToSettingsPage() {
        navigate(getSettingsRoute(urlPrefix))
        handleCloseUserMenu()
    }

    function handleLogout() {
        dispatch(logout())

        // Not strictly needed since this route is access controlled
        navigate(LOGIN_ROUTE)
    }

    const useStyles = makeStyles()((theme) => ({
        text: {
            color: "#fffff"
        },
        avatar: {
            backgroundColor: "transparent",
            color: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
            borderStyle: "solid",
            borderWidth: "1.5px",
        }

    }))



    const { classes, cx } = useStyles()

    return (
        <>
            <Tooltip title={l10n.getString("avatar-menu-tooltip")}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar className={cx(classes.avatar)} >
                        {userInitials?.toUpperCase() ?? "ME"}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="mobile-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                <Box sx={{ padding: ".7rem" }}>

                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" minWidth="15rem">
                        <IconButton sx={{ mb: "0.2rem" }}>
                            <Avatar className={cx(classes.avatar)} >
                                {userInitials?.toUpperCase() ?? "ME"}
                            </Avatar>
                        </IconButton>

                        <Typography textAlign="center" sx={{ display: "inline" }}>
                            {username}
                        </Typography>
                    </Grid>

                    <Divider sx={{ marginX: "1rem", marginBottom: "0.5rem" }} />
                    <MenuItem key="profile" onClick={navigateToProfilePage}>

                        <ListItemIcon sx={{}}>
                            <Person fontSize='small' />
                        </ListItemIcon>
                        <LocalizedStrict id="avatar-menu-menu-item-profile">
                            <Typography display="inline" textAlign="center">User account</Typography>
                        </LocalizedStrict>

                    </MenuItem>
                    <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                        <MenuItem key="settings" onClick={navigateToSettingsPage}>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            <LocalizedStrict id="avatar-menu-menu-item-settings">
                                <Typography textAlign="center">Settings</Typography>
                            </LocalizedStrict>
                        </MenuItem>
                    </MatchEnvironment>
                    <MenuItem key="logout" onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        <LocalizedStrict id="avatar-menu-menu-item-logout">
                            <Typography textAlign="center">Logout</Typography>
                        </LocalizedStrict>
                    </MenuItem>
                </Box>
            </Menu>
        </>
    )
}



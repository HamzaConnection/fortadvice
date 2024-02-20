import { Grid } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { makeStyles } from 'tss-react/mui'
import { EnvironmentType } from '../../modules/environment/envTypes'
import { MatchEnvironment } from '../../modules/environment/components/MatchEnvironment'
import { useAppSelector } from '../../modules/store/storeHooks'
import { UserType } from '../../modules/login/loginTypes'
import { selectEffectiveUserType } from '../../modules/context/contextSelectors'
import { ContextDisplay } from '../../modules/context/components/ContextDisplay'
import { NewsBellNavItem } from './components/NewsBellNavItem'
import { EnvironmentDropdown } from './components/EnviromentDropdown'
import { AvatarMenu } from './components/AvatarMenu'
import { LayoutContainer } from './components/LayoutContainer'
import { drawerWidthCompact, drawerWidthNormal } from './LeftBar'

type StyleProps = Readonly<{
    compactNav: boolean
}>

const useStyles = makeStyles<StyleProps>()((theme, { compactNav }) => ({
    appbar: {
//        backgroundColor: theme.palette.common.black,
    },
    toolbar: {
        paddingLeft: compactNav ? drawerWidthCompact : drawerWidthNormal,
    },
    toolbarRightArea: {
        gap: "1.75rem",
    },
    bell: {
        marginRight: "-0.25rem",
    },
}))

type TopBarProps = Readonly<{
    userTypeRoutePath: string | undefined
    environmentRoutePath: string | undefined
    isAdminEnv: boolean
    compactNav: boolean
}>

export function TopBar({ userTypeRoutePath, environmentRoutePath, isAdminEnv, compactNav }: TopBarProps) {
    const { classes } = useStyles({ compactNav })
    const userType = useAppSelector(selectEffectiveUserType)

    return (
        <AppBar position="sticky" color="inherit" elevation={2} className={classes.appbar}>
            <Toolbar className={classes.toolbar} disableGutters>
                <LayoutContainer>
                    <Grid container wrap="nowrap" justifyContent="space-between" alignItems="center">
                        <ContextDisplay />

                        <Grid container item wrap="nowrap" width="auto" flexGrow={0} className={classes.toolbarRightArea}>
                            <NewsBellNavItem urlPrefix={environmentRoutePath} className={classes.bell} />

                            {(userType === UserType.SUPPORT || userType === UserType.MERCHANT || UserType.OFFICE_MANAGER) && (
                                <EnvironmentDropdown urlPrefix={userTypeRoutePath} isAdminEnv={isAdminEnv} />
                            )}

                            <AvatarMenu urlPrefix={environmentRoutePath} />
                        </Grid>
                    </Grid>
                </LayoutContainer>
            </Toolbar>
        </AppBar>
    )
}

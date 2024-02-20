import { useLocation, useNavigate } from "react-router"
import { Container, Grid, Table, TableCell, TableRow, Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { Player } from "@lottiefiles/react-lottie-player"
import { LocalizedEnum, LocalizedStrict } from "../../localization/components/AppLocalized"
import { SafeArea } from "../../../shared/components/skeleton/SafeArea"
import AccessDeniedAnim from "../assets/access-denied-anim.json"
import { StandardButton } from "../../../shared/components/buttons/StandardButton"
import { LOGIN_ROUTE, ROOT_ROUTE } from "../../../constants/routes"
import { UserType } from '../../login/loginTypes'
import { useAppDispatch } from "../../store/storeHooks"
import { logout } from "../../login/loginSlice"
import { useLocationState } from "../../../core/router/routerHooks"
import { useAppLocalization } from "../../localization/components/AppLocalizationProvider"

const useStyles = makeStyles()((theme) => ({
    root: {
        height: "100vh",
    },
    container: {
        height: "100%",
    },
    outerGrid: {
        height: "100%",
    },
    verticalGrid: {
        height: "80%",
        maxHeight: theme.breakpoints.values["sm"]
    },
    table: {
        maxWidth: theme.breakpoints.values["sm"],
    },
    tableCell: {
        borderBottom: "none",
        paddingTop: "4px",
        paddingBottom: "4px",
    },
    actionArea: {
        columnGap: "2rem",
    }
}))

type AccessDeniedProps = Partial<Readonly<{
    requiredUserTypes: UserType[]
    actualUserType: UserType
    path: string
}>>

function AccessDenied({ requiredUserTypes, actualUserType, path }: AccessDeniedProps) {
    const { classes } = useStyles()

    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { l10n } = useAppLocalization()

    function handleGoHome() {
        navigate(ROOT_ROUTE)
    }

    function handleLogout() {
        dispatch(logout())

        // Need to navigate to login route since this route is not access controlled
        navigate(LOGIN_ROUTE)
    }

    const requiredUserTypesForDisplay =
        requiredUserTypes
            ?.map((userType) => l10n.getStringForEnum("access-denied-usertype", userType, userType))
            .join(", ") ?? "UNKNOWN"

    return (
        <SafeArea fullHeight={false} className={classes.root}>
            <Container className={classes.container}>
                <Grid container direction="column" wrap="nowrap" justifyContent="center" alignItems="center" className={classes.outerGrid}>
                    <Grid item container direction="column" wrap="nowrap" justifyContent="space-evenly" alignItems="center" className={classes.verticalGrid}>
                        <Grid item>
                            <LocalizedStrict id="access-denied-title">
                                <Typography variant="h3">Access Denied</Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid item>
                            <Player src={AccessDeniedAnim} autoplay keepLastFrame speed={0.7} />
                        </Grid>
                        <Grid item>
                            <LocalizedStrict id="access-denied-explanation">
                                <Typography variant="body1" align="center">Your user profile does not have access to this page.</Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid item>
                            <Table className={classes.table}>
                                <TableRow>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <LocalizedStrict id="access-denied-required-usertype-label">
                                            <Typography variant="body1">Required user type(s):</Typography>
                                        </LocalizedStrict>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <Typography variant="body1" color="text.secondary">{requiredUserTypesForDisplay}</Typography>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="right" className={classes.tableCell}>
                                        <LocalizedStrict id="access-denied-actual-usertype-label">
                                            <Typography variant="body1">Actual user type:</Typography>
                                        </LocalizedStrict>
                                    </TableCell>
                                    <TableCell className={classes.tableCell}>
                                        <LocalizedEnum base="access-denied-usertype" enumValue={actualUserType ?? "UNKNOWN"}>
                                            <Typography variant="body1" color="text.secondary">{actualUserType}</Typography>
                                        </LocalizedEnum>
                                    </TableCell>
                                </TableRow>
                                {path && (
                                    <TableRow>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <LocalizedStrict id="access-denied-path-label">
                                                <Typography variant="body1">Path:</Typography>
                                            </LocalizedStrict>
                                        </TableCell>
                                        <TableCell className={classes.tableCell}>
                                            <Typography variant="caption" color="text.secondary">{path}</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Table>
                        </Grid>
                        <Grid item container wrap="nowrap" justifyContent="center" alignItems="center" className={classes.actionArea}>
                            <Grid item>
                                <LocalizedStrict id="access-denied-go-home-button">
                                    <StandardButton size="small" onClick={handleGoHome}>Go home</StandardButton>
                                </LocalizedStrict>
                            </Grid>
                            <Grid item>
                                <LocalizedStrict id="access-denied-logout-button">
                                    <StandardButton size="small" onClick={handleLogout}>Log out</StandardButton>
                                </LocalizedStrict>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </SafeArea>
    )
}

export type AccessDeniedState = AccessDeniedProps

export function AccessDeniedPage({ }) {
    const { requiredUserTypes, actualUserType, path } = useLocationState<AccessDeniedState>({
        requiredUserTypes: undefined,
        actualUserType: undefined,
        path: undefined,
    })

    return (
        <AccessDenied
            requiredUserTypes={requiredUserTypes}
            actualUserType={actualUserType}
            path={path}
        />
    )
}

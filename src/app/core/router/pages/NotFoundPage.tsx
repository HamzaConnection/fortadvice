import { useLocation, useNavigate } from "react-router"
import { Container, Grid, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material"
import { blue } from "@mui/material/colors"
import { makeStyles } from "tss-react/mui"
import { Player } from "@lottiefiles/react-lottie-player"
import { ROOT_ROUTE } from "../../../constants/routes"
import { SafeArea } from "../../../shared/components/skeleton/SafeArea"
import { StandardButton } from "../../../shared/components/buttons/StandardButton"
import { LocalizedStrict } from "../../../modules/localization/components/AppLocalized"
import NotFoundAnim from "../assets/404-not-found-anim-dark.json"

const useStyles = makeStyles()((theme) => ({
    root: {
        height: "100vh",
        color: theme.palette.common.white,
        backgroundColor: blue[500],
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
    animation: {
        height: "14rem",
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

type NotFoundProps = Partial<Readonly<{
    path: string
}>>

function NotFound({ path }: NotFoundProps) {
    const { classes } = useStyles()

    const navigate = useNavigate()

    function handleGoHome() {
        navigate(ROOT_ROUTE)
    }

    return (
        <SafeArea fullHeight={false} className={classes.root}>
            <Container className={classes.container}>
                <Grid container direction="column" wrap="nowrap" justifyContent="center" alignItems="center" className={classes.outerGrid}>
                    <Grid item container direction="column" wrap="nowrap" justifyContent="space-evenly" alignItems="center" className={classes.verticalGrid}>
                        <Grid item>
                            <LocalizedStrict id="not-found-title">
                                <Typography variant="h3">Not Found</Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid item>
                            <Player src={NotFoundAnim} autoplay loop speed={1} className={classes.animation} />
                        </Grid>
                        <Grid item>
                            <LocalizedStrict id="not-found-explanation">
                                <Typography variant="body1" align="center">The page you’re looking for doesn’t exist.</Typography>
                            </LocalizedStrict>
                        </Grid>
                        <Grid item>
                            <Table className={classes.table}>
                                <TableBody>
                                    {path && (
                                        <TableRow>
                                            <TableCell align="right" className={classes.tableCell}>
                                                <LocalizedStrict id="not-found-path-label">
                                                    <Typography variant="body1" color="common.white">Path:</Typography>
                                                </LocalizedStrict>
                                            </TableCell>
                                            <TableCell className={classes.tableCell}>
                                                <Typography variant="caption" color="common.white">{path}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid item container wrap="nowrap" justifyContent="center" alignItems="center" className={classes.actionArea}>
                            <Grid item>
                                <LocalizedStrict id="not-found-go-home-button">
                                    <StandardButton size="small" color="white" onClick={handleGoHome}>Go home</StandardButton>
                                </LocalizedStrict>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </SafeArea>
    )
}

export function NotFoundPage({ }) {
    const { pathname } = useLocation()

    return (
        <NotFound path={pathname} />
    )
}

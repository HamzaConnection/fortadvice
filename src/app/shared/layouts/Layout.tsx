import { makeStyles } from "tss-react/mui"
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';
import { Grid } from "@mui/material";
import { WellknownHeight } from "../../constants/wellknown";

const useStyles = makeStyles()((theme) => ({
    page: {
        height: "100%",
        minHeight: "100vh",
        backgroundColor: theme.palette.tailwind.slate[50],
    },
    container: {
        height: `calc(100% - ${WellknownHeight.PRIMARY_TOP_BAR}px)`,
    },
    contentGrid: {
        height: "100%",

    }
}))

export function Layout() {
    const { classes } = useStyles()

    return (
        <div className={classes.page}>
            <Grid container direction="column" wrap="nowrap" justifyContent="space-between" className={classes.contentGrid}>
                <Grid item>
                    <Outlet />
                </Grid>
                <Footer />
            </Grid>
        </div>
    )
}

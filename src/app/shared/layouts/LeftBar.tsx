import { PropsWithChildren } from "react"
import { Drawer, Grid, IconButton, List, Theme } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import type { CSSObject } from "tss-react"
import { makeStyles } from "tss-react/mui"
import { LayoutContainer } from "./components/LayoutContainer"
import { NavMenuContext } from "./components/NavMenuItem"
import GopayLogo from "!file-loader!./assets/gopay-logo-mono.svg"

// We have to use fixed width because we need to push page content
// so it won't go behind the drawer
export const drawerWidthNormal = "15rem"

// Calculated to center the 2rem logo given the 2rem padding
export const drawerWidthCompact = "6rem"

function createWidthTransition(theme: Theme, compact: boolean) {
    if (compact) {
        return theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    } else {
        return theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        })
    }
}

type StyleProps = Readonly<{
    compact: boolean
}>

const useStyles = makeStyles<StyleProps>()((theme, { compact }) => ({
    navDrawer: {
        width: compact ? drawerWidthCompact : drawerWidthNormal,
        transition: createWidthTransition(theme, compact)
    },
    navDrawerPaper: {
        width: compact ? drawerWidthCompact : drawerWidthNormal,
        // Needed to not cut off the nav toggle button part that is half outside the drawer
        overflowY: "visible",
        backgroundColor: theme.palette.tailwind.sky[900],
        whiteSpace: "nowrap",
        transition: createWidthTransition(theme, compact)
    },
    navHeader: {
        position: "relative",
    },
    // This makes sure the height of the nav header matches the MUI toolbar
    // Needed because toolbar height depends on a set of media queries
    navHeaderHeight: theme.mixins.toolbar as CSSObject,
    loginLogo: {
        width: "2rem",
        height: "auto",
    },
    appName: {
        padding: 0,
        paddingLeft: "0.5rem",
        fontSize: "1.5rem",
        fontFamily: "Poppins, sans-serif",
        fontWeight: 300,
        lineHeight: 1,
        color: theme.palette.common.white,
        // Hide when drawer is compact
        opacity: compact ? 0 : 1,
        transition: compact ? undefined: "opacity 1s"
    },
    navToggleButton: {
        // Position to be half out of the drawer
        position: "absolute",
        right: 0,
        // Icon inside is 1.5rem and we have 2px padding in each side
        marginRight: "calc(-1 * (2px + 2px + 1.5rem) / 2)",
        padding: "2px",
        color: theme.palette.tailwind.slate[50],
        backgroundColor: theme.palette.tailwind.sky[500],
        boxShadow: theme.shadows[1],
        "&:hover": {
            backgroundColor: theme.palette.tailwind.sky[600],
        },
    },
    // We use the list to cut off overflowing nav menu item text
    // This ensures that the text never sticks out of the drawer
    // We cannot do it on the drawer since our nav toggle button
    // deliberately sticks out of the drawer
    navList: {
        width: compact ? drawerWidthCompact : drawerWidthNormal,
        overflowX: "hidden",
        transition: createWidthTransition(theme, compact),
    },
}))

type LeftBarProps = Readonly<PropsWithChildren<{
    compact: boolean
    onCompactToggle: () => void
}>>

export function LeftBar({ compact, onCompactToggle, children }: LeftBarProps) {
    const { classes, cx } = useStyles({ compact })

    // NOTE: We cannot wrap the list in layout container since the active mark for
    // the active nav menu item should appear flush with left side of screen

    return (
        <NavMenuContext.Provider value={{ compact }}>
            <Drawer variant="permanent" open={compact} PaperProps={{ elevation: 4 }} classes={{ paper: classes.navDrawerPaper }} className={classes.navDrawer}>
                <LayoutContainer disableRight>
                    <Grid container wrap="nowrap" alignItems="center" className={cx(classes.navHeader, classes.navHeaderHeight)}>
                        <img src={GopayLogo} className={classes.loginLogo} />
                        <span className={classes.appName}>GoPay</span>
                        <IconButton onClick={onCompactToggle} className={classes.navToggleButton}>
                            {compact ? <ChevronRight /> : <ChevronLeft />}
                        </IconButton>
                    </Grid>
                </LayoutContainer>
                <List className={classes.navList}>
                    {children}
                </List>
            </Drawer>
        </NavMenuContext.Provider>
    )
}

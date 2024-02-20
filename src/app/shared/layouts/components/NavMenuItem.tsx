import { PropsWithChildren, createContext, useCallback, useContext } from "react"
import { useMatch, useNavigate } from "react-router-dom"
import { Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material"
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome"
import { makeStyles } from "tss-react/mui"
import { LayoutContainer } from "./LayoutContainer"

// NOTE: We use context to inform nav menu items about compact state of nav drawer
type NavMenuItemContextType = Readonly<{
    compact: boolean
}>

export const NavMenuContext = createContext<NavMenuItemContextType>({ compact: false })

type StyleProps = Readonly<{
    compact: boolean
    isActive: boolean
}>

const useStyles = makeStyles<StyleProps>()((theme, { compact, isActive }) => ({
    navItem: {
        // We use box shadow instead of border-left so the list item contents won't
        // be indented by the width of the border
        boxShadow: isActive ? `inset 4px 0px ${theme.palette.tailwind.slate[100]}` : undefined
    },
    navItemIcon: {
        // Width same as width of logo in left bar header
        width: "2rem",
        minWidth: 0,
        color: theme.palette.tailwind.green[300],
    },
    navItemText: {
        paddingLeft: "0.5rem",
        color: theme.palette.tailwind.slate[100],
        opacity: compact ? 0 : 1,
        transition: "opacity 0.25s",
    },
}))

type NavMenuItemProps = Readonly<PropsWithChildren<{
    icon: FontAwesomeIconProps["icon"]
    dest: string
}>>

export function NavMenuItem({ icon, dest, children }: NavMenuItemProps) {
    const { compact } = useContext(NavMenuContext)

    const matchesCurrent = useMatch(dest)
    const navigate = useNavigate()

    const { classes } = useStyles({ compact, isActive: matchesCurrent !== null })

    const handleClick = useCallback(() => navigate(dest), [navigate, dest])

    // NOTE: We need to wrap contents in layout container to get correct padding

    return (
        <ListItem disableGutters className={classes.navItem}>
            <LayoutContainer>
                <ListItemButton onClick={handleClick} disableGutters>
                    {compact ? (
                        <Tooltip title={children} placement="right">
                            <ListItemIcon className={classes.navItemIcon}>
                                <Grid container justifyContent="center">
                                    <FontAwesomeIcon icon={icon} size="lg" />
                                </Grid>
                            </ListItemIcon>
                        </Tooltip>
                    ) : (
                        <ListItemIcon className={classes.navItemIcon}>
                            <Grid container justifyContent="center">
                                <FontAwesomeIcon icon={icon} size="lg" />
                            </Grid>
                        </ListItemIcon>
                    )}
                    <ListItemText
                        primaryTypographyProps={{ variant: "body2" }}
                        className={classes.navItemText}
                    >
                        {children}
                    </ListItemText>
                </ListItemButton>
            </LayoutContainer>
        </ListItem>
    )
}

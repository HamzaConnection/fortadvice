import { Button, Grid, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { useState } from "react"
import { useLocation, useMatch, useNavigate } from "react-router-dom"
import { MERCHANT_ADMIN_ROUTE, MERCHANT_REPORTS_ROUTE, getAdminRoute, getReportRoute } from "../../../constants/routes"
import { useAppLocalization } from "../../../modules/localization/components/AppLocalizationProvider"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUserGear } from "@fortawesome/pro-solid-svg-icons"
import { faFileChartPie } from "@fortawesome/pro-regular-svg-icons"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { grey } from "@mui/material/colors"
import { makeStyles } from "tss-react/mui"

type DropDownValue =
    | "Reports"
    | "Admin"

const useStyles = makeStyles()((theme) => ({
    envSelectButton: {
        color: theme.palette.text.secondary,
        marginLeft: 0,
        textTransform: "none",
    },
    menu: {
        marginTop: "1rem",
    },
}))

type Props = Readonly<{
    urlPrefix: string | undefined
    isAdminEnv: boolean
}>

export function EnvironmentDropdown({ urlPrefix, isAdminEnv }: Props) {
    const { classes } = useStyles()

    const [dropDownAnchorEl, setdropDownAnchorEl] = useState<null | HTMLElement>(null)
    const [dropDownValue, setDropDownValue] = useState<DropDownValue>(isAdminEnv ? "Admin" : "Reports")

    const navigate = useNavigate()

    const { l10n } = useAppLocalization()

    const open = Boolean(dropDownAnchorEl)

    function handledropDownClick(event: React.MouseEvent<HTMLElement>) {
        setdropDownAnchorEl(event.currentTarget)
    }

    function handledropDownClose() {
        setdropDownAnchorEl(null)
    }

    return (
        <>
            <Button
                size="small"
                variant="text"
                onClick={handledropDownClick}
                endIcon={<KeyboardArrowDownIcon />}
                className={classes.envSelectButton}
            >
                <Typography variant="body1">
                    {l10n.getStringForEnum("env-dropdown", dropDownValue, dropDownValue)}
                </Typography>
            </Button>

            <Menu
                anchorEl={dropDownAnchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={open}
                onClose={handledropDownClose}
                className={classes.menu}
            >
                <Grid container direction="row" justifyContent="space-between" width="10rem">
                    <MenuItem onClick={() => {
                        setDropDownValue("Admin")
                        handledropDownClose()
                        navigate(getAdminRoute(urlPrefix))
                    }}>
                        <ListItemIcon sx={{}}>
                            < FontAwesomeIcon icon={faUserGear} />
                        </ListItemIcon>
                        {l10n.getString("env-dropdown-admin")}
                    </MenuItem>
                    <MenuItem onClick={() => {
                        setDropDownValue("Reports")
                        handledropDownClose()
                        navigate(getReportRoute(urlPrefix))
                    }}>
                        <ListItemIcon sx={{}}>
                            <FontAwesomeIcon icon={faFileChartPie} />
                        </ListItemIcon>
                        {l10n.getString("env-dropdown-reports")}</MenuItem>
                </Grid>
            </Menu >
        </>
    )
}

import { Collapse, Container, Divider, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { LocalizedEnum, LocalizedStrict } from "../../localization/components/AppLocalized"
import { faSliders } from '@fortawesome/pro-light-svg-icons'
import { SettingsHeader } from '../components/SettingsHeader'
import { Box } from '@mui/system'
import { ExpandLess, ExpandMore, StarBorder } from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons'
import { useExternalLinks } from '../../../shared/hooks/useAppLinks'
import { useLocaleSelect } from "../../localization/localizationHooks"



const useStyles = makeStyles()((theme) => ({
    container: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5),
    },

    contentCenter: {
        display: "flex",
        justifyContent: "center",
    },

    icon: {
        height: "4rem",
        width: "auto",
        color: "#000000",
    },
}))

type SettingsProps = Readonly<{}>

export function Settings({ }: SettingsProps) {
    const { classes } = useStyles()
    const { supportedLocales, selectedLocale, selectLocale } = useLocaleSelect()

    function handleLocaleChange(event: SelectChangeEvent<string>) {
        selectLocale(event.target.value)
    }

    const handleExternalLink = useExternalLinks();


    return (
        <Container sx={{ my: 8 }}>

            <SettingsHeader icon={faSliders} translationsId='settings-title' />

            <TableContainer component={Paper} elevation={0}>
                <Table sx={{ width: "400px", flexWrap: "wrap" }}>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ border: "0", width: "12rem", fontSize: "1rem" }} component="th" scope="row">
                                <LocalizedStrict id="settings-language-setting">
                                    <span>Language</span>
                                </LocalizedStrict>
                            </TableCell>
                            <TableCell sx={{ border: "0", width: "5rem" }} align="left">
                                <Select value={selectedLocale} onChange={handleLocaleChange} size="small" autoWidth >
                                    {supportedLocales.map((locale) => (
                                        <MenuItem key={locale} value={locale}>
                                            <LocalizedEnum base="language-selector-lang" enumValue={locale}>
                                                <span>{locale}</span>
                                            </LocalizedEnum>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>






            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginY: "3rem" }}
                component="nav"
                subheader={
                    <LocalizedStrict id='settings-social-media-label'>
                        <Typography variant='subtitle1'>Social Media</Typography>
                    </LocalizedStrict>
                }
            >

                <Divider sx={{ marginTop: "0.5rem" }} />

                <ListItemButton sx={{ marginY: "0.5rem", display: "flex", justifyContent: "space-between" }} onClick={() => handleExternalLink("https://www.linkedin.com/company/facilitynet/")} >
                    <Box sx={{ marginY: "0.5rem" }}>
                        <LocalizedStrict id="settings-social-media-text">
                            <span>
                                Follow us on Linkedin
                            </span>

                        </LocalizedStrict>
                    </Box>

                    <FontAwesomeIcon icon={faChevronRight} />

                </ListItemButton>
                <Divider />
            </List>

            <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', marginY: "3rem" }}
                component="nav"
                subheader={
                    <LocalizedStrict id='settings-policies-label'>
                        <Typography variant='subtitle1'>Policies</Typography>
                    </LocalizedStrict>
                }
            >
                <Divider sx={{ marginTop: "0.5rem" }} />

                <ListItemButton sx={{ marginY: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                    <Box>
                        <LocalizedStrict id="settings-policies-text">
                            <a href='https://support.facilitynet.dk/hc/da/articles/360052259632' target='_blank' style={{ textDecoration: "none", color: "black" }}>
                                Privacy Policy
                            </a>
                        </LocalizedStrict>
                    </Box>

                    <FontAwesomeIcon icon={faChevronRight} />

                </ListItemButton>
                <Divider />

                <ListItemButton sx={{ marginY: "0.5rem", display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ marginY: "0.5rem" }}>
                        <LocalizedStrict id="settings-eula-text">
                            <a href='https://support.facilitynet.dk/hc/da/articles/360052259632' target='_blank' style={{ textDecoration: "none", color: "black" }}>
                                EULA
                            </a>
                        </LocalizedStrict>
                    </Box>
                    <FontAwesomeIcon icon={faChevronRight} />
                </ListItemButton>
                <Divider />
            </List>
        </Container>
    )
}

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Drawer, Grid, Typography } from '@mui/material'
import { makeStyles } from "tss-react/mui"


import BackgroundImage from './assets/large-GoPay-manager-Frontpage-background.jpg'
import FrontpageLogo from '!file-loader!./assets/gopay-logo-horizontal-white.svg'

import LoginLogo from '!file-loader!./assets/gopay-logo-only-transparent.svg'
import { StandardButton } from '../../shared/components/buttons/StandardButton'
import { Footer } from '../../shared/layouts/Footer'
import { LanguageSelector } from '../../shared/components/languageSelector/LanguageSelector'
import { useAppLocalization } from '../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../localization/components/AppLocalized'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faSquareCheck } from '@fortawesome/pro-solid-svg-icons'



const useStyles = makeStyles()((theme) => ({
    page: {
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundPositionY: "70%",

        [theme.breakpoints.up("sm")]: {
            // Adjust background image position on mobile landscape
            backgroundPositionX: "50%",
        },

        [theme.breakpoints.down(600)]: {
            // Adjust background image position on mobile landscape
            backgroundPositionX: "60%",
        },

    },

    languageSelector: {
        margin: theme.spacing(1),
    },
    loginButton: {
        margin: "1.5rem",
        borderColor: theme.palette.common.white,
    },

    mainDrawerGrid: {
        height: "100%",
        paddingTop: "4rem",
        paddingLeft: "4rem",
        paddingRight: "4rem",
        // NOTE: Moved padding bottom to Footer since it was ignored by browser on overflow when placed here
        //paddingBottom: "2rem",

        // We use smaller horizontal padding on mobile screens in landscape
        [theme.breakpoints.down("sm")]: {
            paddingLeft: "2rem",
            paddingRight: "2rem",
        }
    },
    frontPageLogo: {
        width: "8.625rem",
        height: "auto",
        marginLeft: "5rem",

        [theme.breakpoints.down(650)]: {
            marginLeft: "1.5rem",
            width: "6rem"
        }

    },

    title: {
        marginLeft: "5rem",
        fontSize: "3.5rem",
        lineHeight: "3.5rem",
        width: "30rem",

        [theme.breakpoints.down(1200)]: {
            fontSize: "3rem",
        },
        [theme.breakpoints.down(860)]: {
            fontSize: "2.5rem"
        },
        [theme.breakpoints.down(820)]: {
            fontSize: "2rem",
            lineHeight: '2.2rem',
            width: "12rem",
        },

        [theme.breakpoints.down(650)]: {
            display: "none"
        }
    },

    subTitleTest: {
        fontSize: "1.5rem",

        [theme.breakpoints.down(1200)]: {
            fontSize: "1.5rem",
            width: "25rem"
        },
        [theme.breakpoints.down(1062)]: {
            width: "17rem"
        },
        [theme.breakpoints.down(860)]: {
            fontSize: "1.4rem",
        },
        [theme.breakpoints.down(820)]: {
            fontSize: "1.2rem",
            width: "10rem"
        },
    },

    subTitleContainer:
    {
        marginTop: "1rem",
        marginLeft: "5.5rem",
        width: "30rem",
        display: "flex",
        alignItems: 'flex-start',
        flexWrap: 'nowrap',
        [theme.breakpoints.down(650)]: {
            fontSize: "1rem",
            display: 'none',
        }

    },

    loginLogo: {
        width: "5.625rem",
        height: "auto",
    },

    appName: {
        fontSize: "1.8rem",
        fontFamily: "Poppins, sans-serif",  // TODO Use special font that matches our logo
        padding: 0,
        marginTop: "1rem",
        marginBottom: "5rem",
    },

    topBar: {
        marginTop: "0rem",
    },

    rightTopBar: {
        marginRight: "2rem",
        [theme.breakpoints.down(650)]: {
            marginRight: "0rem"
        }
    },

    content: {
        marginTop: "7rem",
        [theme.breakpoints.down(1025)]: {
        }

    },


}))

type StartPageLayoutProps = Readonly<{}>

export function StartPageLayout({ }: StartPageLayoutProps) {
    const { l10n } = useAppLocalization()
    const { classes } = useStyles()

    const [drawerOpen, setDrawerOpen] = useState(false)

    return (
        <Grid container direction="column" component="main" className={classes.page} alignItems="flex-start" wrap='nowrap'>
            <Grid item container justifyContent="space-between" wrap='nowrap' className={classes.topBar} >

                <img src={FrontpageLogo} className={classes.frontPageLogo} />

                <Grid item display="flex" className={classes.rightTopBar}>
                    <LanguageSelector className={classes.languageSelector} />
                    <LocalizedStrict id='start-page-layout-login-button-label'>
                        <StandardButton
                            variant="outlined"
                            fullWidth={false}
                            color="white"
                            className={classes.loginButton}
                            onClick={() => setDrawerOpen(true)}
                            disableRipple
                            disableFocusRipple
                        >
                            Login
                        </StandardButton>
                    </LocalizedStrict>
                </Grid>
            </Grid>

            <Grid container className={classes.content}>
                <Grid item>
                    <LocalizedStrict id="start-page-layout-title">
                        <Typography color={'#fff'} variant="h6" className={classes.title} >
                            Easy Canteen Management</Typography>
                    </LocalizedStrict>
                    <Box className={classes.subTitleContainer}>
                        <FontAwesomeIcon icon={faCheck} size='2x' style={{ color: "#fff", paddingRight: "1rem" }} />
                        <LocalizedStrict id="start-page-layout-sub-title-1">
                            <Typography color={'#fff'} variant="h3" className={classes.subTitleTest} >
                                Accept payments with the POS and mobile phone</Typography>
                        </LocalizedStrict>
                    </Box>

                    <Box className={classes.subTitleContainer}>
                        <FontAwesomeIcon icon={faCheck} size='2x' style={{ color: "#fff", paddingRight: "1rem" }} />
                        <LocalizedStrict id="start-page-layout-sub-title-2">
                            <Typography color={'#fff'} variant="h3" className={classes.subTitleTest}>
                                Get insight into sales figures with GoPay Manager
                            </Typography>
                        </LocalizedStrict>
                    </Box>

                    <Box className={classes.subTitleContainer}>
                        <FontAwesomeIcon icon={faCheck} size='2x' style={{ color: "#fff", paddingRight: "1rem" }} />
                        <LocalizedStrict id="start-page-layout-sub-title-3">
                            <Typography color={'#fff'} variant="h3" className={classes.subTitleTest}>
                                Better communication between merchant and customers
                            </Typography>
                        </LocalizedStrict>
                    </Box>
                </Grid>
            </Grid >

            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Grid container direction="column" wrap="nowrap" justifyContent="space-between" className={classes.mainDrawerGrid}>
                    <Grid item container direction="column" wrap="nowrap" alignItems="center">
                        <img src={LoginLogo} className={classes.loginLogo} />
                        <p className={classes.appName}>GoPay Manager</p>
                        <Outlet />
                    </Grid>
                    <Footer />
                </Grid>
            </Drawer>
        </Grid >
    )
}

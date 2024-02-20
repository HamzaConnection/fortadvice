import React, { PropsWithChildren } from 'react'
import { AppBar, Grid, IconButton, MenuItem, Select, Toolbar, Typography } from '@mui/material'
import { makeStyles } from "tss-react/mui"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes"
import { faChevronLeft } from "@fortawesome/pro-light-svg-icons/faChevronLeft"
import { faEllipsisV } from "@fortawesome/pro-light-svg-icons/faEllipsisV"
import { WellknownHeight } from '../../../constants/wellknown'
import { LocalizedEnum } from '../../../modules/localization/components/AppLocalized'
import { SafeArea } from "./SafeArea"
import { useInView } from 'react-intersection-observer'
import { useLocaleSelect } from '../../../modules/localization/localizationHooks'

const useStandardTopbarStyles = makeStyles()((theme) => ({
    root: {
        backgroundColor: theme.palette.common.white,
    },
    bottomGrid: {
        width: "100%",
    },
    spacer: {
        paddingBottom: WellknownHeight.PRIMARY_TOP_BAR,
    },
    hidden: {
        visibility: "hidden",
    },
    languageSelect: {
        fontSize: "0.9rem",
        // Gets rid of standard underline
        "&::before": {
            borderBottom: "none",
        },
        // Gets rid of blue underline when focused
        "&::after": {
            borderBottom: "none",
        },
    },
    languageSelectRoot: {
        // Gets rid of grey background color when focused
        "&.MuiSelect-select:focus": {
            backgroundColor: "transparent",
        },
    },
}))

interface StandardTopbarProps {
    middleElement?: React.ReactNode
    bottomElement?: React.ReactNode
    backButtonType?: "close" | "back" | "none"
    hideMenuButton?: boolean
    hideSpacer?: boolean
    onBackButton: (() => void) | undefined
    onMenuButton: (() => void) | undefined
}

export function StandardTopbar(props: StandardTopbarProps) {
    const {
        middleElement,
        bottomElement,
        backButtonType = "close",
        hideMenuButton = false,
        hideSpacer = false,
        onBackButton,
        onMenuButton,
    } = props

    const { classes, cx } = useStandardTopbarStyles()
    const { ref: spacerRef, inView: isAtTop } = useInView({ threshold: 0.5 })
    const elevation = isAtTop ? 0 : 4

    return (
        <>
            <AppBar position="sticky" elevation={elevation} className={classes.root}>
                <Toolbar>
                    <SafeArea position="relative">
                        <Grid container direction="column" wrap="nowrap">
                            <Grid item container wrap="nowrap" justifyContent="space-between" alignItems="center">
                                <Grid item>
                                    <IconButton
                                        disabled={!onBackButton}
                                        onClick={onBackButton}
                                        edge="start"
                                        color="inherit"
                                        aria-label="close"
                                        className={cx({
                                            [classes.hidden]: backButtonType === "none"
                                        })}
                                    >
                                        <FontAwesomeIcon icon={(backButtonType === "close" ? faTimes : faChevronLeft)} color="black" size="1x" />
                                    </IconButton>
                                </Grid>

                                <Grid item>{middleElement}</Grid>

                                <Grid item>
                                    <IconButton
                                        disabled={!onMenuButton}
                                        onClick={onMenuButton}
                                        color="inherit"
                                        aria-label="menu"
                                        className={cx({
                                            [classes.hidden]: hideMenuButton
                                        })}
                                    >
                                        <FontAwesomeIcon icon={faEllipsisV} color="black" size="1x" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {bottomElement && (
                                <Grid item className={classes.bottomGrid}>
                                    {bottomElement}
                                </Grid>
                            )}
                        </Grid>
                    </SafeArea>
                </Toolbar>
            </AppBar>
            {!hideSpacer && (
                <Toolbar ref={spacerRef} className={classes.spacer} />
            )}
        </>
    )
}

const useTitleStyles = makeStyles()((_theme) => ({
    title: {
        color: "#505050",
        fontSize: "1.0625rem",  // 17px @ std
        fontWeight: "bold",
        letterSpacing: "0.1px",
        whiteSpace: "nowrap",
    }
}))

type StandardTopbarTitleProps = Readonly<PropsWithChildren<{}>>

export function StandardTopbarTitle({ children }: StandardTopbarTitleProps) {
    const { classes } = useTitleStyles()

    return (
        <Typography className={classes.title}>{children}</Typography>
    )
}

type LanguageTopbarProps = Readonly<{}>

export function LanguageTopbar({ }: LanguageTopbarProps) {
    const { classes } = useStandardTopbarStyles()
    const { supportedLocales, selectedLocale, selectLocale } = useLocaleSelect()

    return (
        <AppBar position="fixed" elevation={0} className={classes.root}>
            <Toolbar>
                <SafeArea top position="relative">
                    <Select
                        variant="standard"
                        value={selectedLocale}
                        onChange={(event) => selectLocale(event.target.value as string)}
                        className={classes.languageSelect}
                        classes={{ select: classes.languageSelectRoot }}
                    >
                        {supportedLocales.map((locale) => (
                            <MenuItem key={locale} value={locale}>
                                <LocalizedEnum base="language-topbar-locale" enumValue={locale}>
                                    <span>{locale}</span>
                                </LocalizedEnum>
                            </MenuItem>
                        ))}
                    </Select>
                </SafeArea>
            </Toolbar>
        </AppBar>
    )
}

import { Grid, Link, Typography } from '@mui/material'
import { makeStyles } from "tss-react/mui"
import { AppVersion } from '../../modules/environment/components/AppVersion'
import { LocalizedStrict } from '../../modules/localization/components/AppLocalized'

const useStyles = makeStyles()((_theme) => ({
    footerText: {
        marginTop: "2rem",
        // NOTE: Have to use padding instead of margin for the browser to respect it on overflow
        paddingBottom: "2rem",
    },
    versionText: {
        width: "4rem",
        marginTop: "4rem"
    }
}))

export function Footer() {
    const { classes } = useStyles()

    return (
        <Grid container wrap="nowrap" justifyContent="space-between" alignItems="center">
            <p className={classes.versionText}></p>

            {/* <LocalizedStrict id="footer-read-more" vars={{ linkName: "gopay.menu"}} elems={{ linkElem: <Link href="https://gopay.menu" target="_blank"></Link> }}>
                <Typography variant="body2" color="text.secondary" align="center" className={classes.footerText}>
                    {'Read more at gopay.menu'}
                </Typography>
            </LocalizedStrict> */}
            <AppVersion className={classes.versionText} />
        </Grid>
    )
}

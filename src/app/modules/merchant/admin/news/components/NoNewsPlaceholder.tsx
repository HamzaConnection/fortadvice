import { Grid, Typography } from '@mui/material';
import { Link, } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui'
import { Player } from "@lottiefiles/react-lottie-player"
import NotFoundAnim from "../assets/96253-data-not-found.json"
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { TranslationKey } from '../../../../localization/translations';





type NoNewsPlaceholderProps = Readonly<{
    header: TranslationKey,
    body?: TranslationKey,
    linkText?: TranslationKey,
    link?: string,
}>

export function NoNewsPlaceholder({ header, body, linkText, link }: NoNewsPlaceholderProps) {

    const useStyles = makeStyles()((theme) => ({

        animation: {
            height: "17.5rem",
        },
    }))

    const { classes } = useStyles()
    const { l10n } = useAppLocalization()


    return (
        <>
            <Grid alignItems="center" textAlign="center" paddingTop="1rem">
                <LocalizedStrict id={header}>
                    <Typography variant="h4" sx={{ marginBottom: "-4.5rem" }}>
                        No news
                    </Typography>
                </LocalizedStrict>
                <Player src={NotFoundAnim} autoplay loop speed={1} className={classes.animation} />
                <Typography>
                    {body ? l10n.getString(body) : ""} { }
                    <Link to={link ?? ""}> {linkText ? l10n.getString(linkText) : ""}</Link>
                </Typography>

                {/* <StandardButton sx={{ marginTop: "1rem" }} size='medium' fullWidth={false} startIcon={<FontAwesomeIcon icon={faCirclePlus} />
                } color="black" onClick={() => navigate(MERCHANT_CREATE_NEWS_ROUTE)}>Create new</StandardButton> */}


            </Grid>
        </>
    )
}

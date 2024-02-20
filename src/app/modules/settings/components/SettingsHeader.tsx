import { IconDefinition, faSliders } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Divider, Typography } from '@mui/material';
import { makeStyles } from "tss-react/mui"
import { Box } from '@mui/system';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { TranslationKey } from '../../localization/translations';



type SettingsHeaderProps = Readonly<{
    icon: IconDefinition
    translationsId: TranslationKey

}>


export function SettingsHeader({ icon, translationsId }: SettingsHeaderProps) {

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
    const { classes } = useStyles()

    return (
        <>
            <Box className={classes.contentCenter}>
                <FontAwesomeIcon icon={icon} className={classes.icon} />
            </Box>
            <LocalizedStrict id={translationsId}>
                <Typography variant="h5" gutterBottom align="center" paddingTop="1rem" paddingBottom="3rem"></Typography>
            </LocalizedStrict>
            <Divider sx={{ marginBottom: "4rem" }} />
        </>
    )
}

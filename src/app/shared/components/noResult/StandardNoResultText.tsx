import { Grid, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';

const useStyles = makeStyles()((theme) => ({

}))


type StandardNoResultTextProps = Readonly<{
    noResultText?: string
}>

export function StandardNoResultText({ noResultText }: StandardNoResultTextProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    console.log(noResultText);

    return (
        <Grid container justifyContent={"center"} marginTop="10rem">

            {noResultText ? <Typography variant='h6' sx={{ color: "#64748B", paddingBottom: "0.5rem" }}>{noResultText}</Typography>
                :
                <LocalizedStrict id='production-list-no-result'>
                    <Typography variant='h6' sx={{ color: "#64748B", paddingBottom: "0.5rem" }}>No result</Typography>
                </LocalizedStrict>
            }
        </Grid >
    )
}



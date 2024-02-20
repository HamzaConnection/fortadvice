import { Checkbox, FormControlLabel, FormGroup, Grid, Link, Typography } from '@mui/material';
import { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useMoney } from '../../../modules/currency/useMoney';
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../modules/localization/useDateTime';


const useStyles = makeStyles()((theme) => ({
    FormControlLabel: {
        marginTop: "2rem"
    }
}))


type AcceptTermsCheckboxProps = Readonly<{
    termsText?: string,
    accepted: boolean
    setAccepted: React.Dispatch<React.SetStateAction<boolean>>
}>

export function AcceptTermsCheckbox({ termsText, accepted = false, setAccepted }: AcceptTermsCheckboxProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()




    const handleCheckboxChange = () => {
        setAccepted(!accepted);
    };

    // const handleExternalLink = useExternalLinks();


    return (

        <Grid container justifyContent={"center"} className={classes.FormControlLabel}>
            <FormControlLabel
                control={<Checkbox checked={accepted} onChange={handleCheckboxChange} />}
                label={termsText}
            />
        </Grid>

    )
}



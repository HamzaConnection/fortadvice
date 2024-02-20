
import { makeStyles } from 'tss-react/mui';
import { useMoney } from '../../../modules/currency/useMoney';
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../modules/localization/useDateTime';
import { CircularProgress, Grid } from "@mui/material"

const useStyles = makeStyles()((theme) => ({

}))


type LoadingSpinnerProps = Readonly<{

}>

export function LoadingSpinner({ }: LoadingSpinnerProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})
    return (
        <Grid container justifyContent={"center"} marginTop="15rem">
            <CircularProgress size={70} />
        </Grid>
    )
}



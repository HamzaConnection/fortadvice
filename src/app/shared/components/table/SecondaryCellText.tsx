import { Tooltip, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';

const useStyles = makeStyles()((theme) => ({

}))


type SecondaryCellTextProps = Readonly<{
    tooltipTitle: string
    text: string
    text2?: string
}>

export function SecondaryCellText({ text, text2, tooltipTitle }: SecondaryCellTextProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()

    const getVariant = () => {

        if (text && text2) {
            return (<Tooltip title={tooltipTitle}>
                <Typography fontSize="12px" variant='caption' color="text.secondary">{text} - {text2}
                </Typography>
            </Tooltip>)
        } else {
            return (<Tooltip title={tooltipTitle}>
                <Typography fontSize="12px" variant='caption' color="text.secondary">{text}
                </Typography>
            </Tooltip>)
        }
    }


    return (
        <>
            {getVariant()}
        </>
    )
}



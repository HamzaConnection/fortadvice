import { makeStyles } from 'tss-react/mui';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';
import { StandardLoadingButton, StandardLoadingButtonProps } from '../buttons/LoadingButton';

const useStyles = makeStyles()((_theme) => ({
    button: {
        width: "6rem",
    },
}))

type StandardExportButtonProps = Pick<StandardLoadingButtonProps, "endIcon" | "onClick"> & Readonly<{
    loading?: StandardLoadingButtonProps["loading"]
}>

export function StandardExportButton({ loading = false, endIcon, onClick }: StandardExportButtonProps) {
    const { classes } = useStyles()

    return (
        <LocalizedStrict id='export-button-export-text'>
            <StandardLoadingButton
                variant="outlined"
                size="small"
                endIcon={endIcon}
                loading={loading}
                onClick={onClick}
                className={classes.button}
            >
                Export
            </StandardLoadingButton>
        </LocalizedStrict>
    )
}

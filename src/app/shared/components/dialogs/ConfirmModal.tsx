import { Grid, Typography } from '@mui/material';
import { StandardDialog } from './StandardDialog';
import { StandardTopbarTitle } from '../skeleton/TopBar';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';
import { MerchantNewsArticle } from '../../../modules/merchant/admin/news/merchantNewsItemType';
import { makeStyles } from 'tss-react/mui';

import { StandardButton } from '../buttons/StandardButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleX } from '@fortawesome/pro-light-svg-icons';
import { useApiMutation } from '../../../core/api/useApiMutation';
import { deleteMerchantAdminNews } from '../../../modules/merchant/admin/news/merchantAdminNewsApi';
import { useAppSelector } from '../../../modules/store/storeHooks';
import { selectEffectiveCompanyId } from '../../../modules/context/contextSelectors';
import { AcceptTermsCheckbox } from '../checkbox/AcceptTermsCheckbox';
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';
import { PropsWithChildren } from 'react';


type ConfirmModalProps = Readonly<PropsWithChildren<{
    open: boolean,
    onClose: () => void,
    domainTitle?: string,
    subject?: string,
    handleClick(): void
    buttonLabelSubmit: string
    buttonLabelCancel?: string
    question?: string,
}>>



const useStyles = makeStyles()((theme) => ({

    container: {
        paddingBottom: theme.spacing(16),
        marginTop: "-1rem",

    },


    card: {
        position: "relative",
        width: "50%", // set according to gap %
        border: 'none',
        [theme.breakpoints.down(1000)]: {
            width: "50%", // set according to gap %
        },

        [theme.breakpoints.down("sm")]: {
            width: "50%",
        },
    },

    chip: {
        padding: '0.1rem',
        borderRadius: 0,
        position: "absolute",
        top: 0,
        right: 0,
    }
}))






export function ConfirmModal({ open, onClose, domainTitle, subject, handleClick, buttonLabelSubmit, buttonLabelCancel, question, children }: ConfirmModalProps) {

    const { classes, cx } = useStyles()

    const { l10n } = useAppLocalization()




    return (
        <StandardDialog
            // titleElement={(
            //     <LocalizedStrict id="delete-news-modal-title">
            //         <StandardTopbarTitle>Delete</StandardTopbarTitle>
            //     </LocalizedStrict>

            // )}
            open={open}
            onClose={onClose}
            maxWidthProp='md'
        >

            <Grid container justifyContent="center" alignItems="center" direction="column" wrap="nowrap" className={classes.container}>


                <Typography variant='h5' sx={{ marginBottom: "2rem", marginTop: "1.5rem", fontWeight: "bold" }}>
                    {domainTitle}
                </Typography>

                <Typography variant='body1' sx={{ marginBottom: "1.2rem" }}>
                    {question ? question : l10n.getString("confirm-modal-confirm-label")}
                </Typography>


                <Grid item alignContent="center" textAlign="center" paddingX="1rem">
                    <Typography variant='body1' sx={{ fontWeight: "bold" }}>
                        {subject ? `${"[" + subject + "]" + "?"}` : ""}
                    </Typography>
                </Grid>

                {children}


                <Grid container width={"65%"} direction="row" wrap='nowrap' gap={4} marginTop="5rem" marginBottom="-4rem">

                    <StandardButton sx={{ marginLeft: "2rem" }} color='error' onClick={() => {
                        handleClick()
                        onClose()
                    }}>{buttonLabelSubmit}</StandardButton>


                    <LocalizedStrict id="delete-news-modal-button-cancel-label">
                        <StandardButton sx={{ marginRight: "2rem" }} color='black' onClick={onClose}>{(buttonLabelCancel === "" || buttonLabelCancel === undefined) ? l10n.getString("delete-news-modal-button-cancel-label") : buttonLabelCancel}</StandardButton>
                    </LocalizedStrict>
                </Grid>

            </Grid>
        </StandardDialog>
    )
}

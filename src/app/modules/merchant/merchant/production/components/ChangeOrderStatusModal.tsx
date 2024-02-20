import { Grid, List, ListItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { StandardDialog } from '../../../../../shared/components/dialogs/StandardDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleX, faInboxIn, faInboxOut } from '@fortawesome/pro-light-svg-icons';
import { useState } from 'react';
import { Order, OrderStatus } from '../../../controlKitchenTypes';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { setOrderStatus, TransactionResult } from '../productionApi';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { highlightColor } from '../../../../../shared/colors/Colors';
import { MRT_RowSelectionState } from 'material-react-table';
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { borderBottom } from '@mui/system';
import { useSnackbar } from 'notistack';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { UseMutateAsyncFunction } from '@tanstack/react-query';



const useStyles = makeStyles()((theme) => ({


    modalContainer: {
        paddingBottom: theme.spacing(12),
        marginTop: "-1rem",
        paddingRight: "5rem",
        paddingLeft: "5rem",

    },

    listItem: {
        "&:hover": {
            cursor: "pointer",
        },
        borderBottom: ".5px solid rgba(0, 0, 0, 0.12)",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem"

    },

    fontawesomeIcon: {
        paddingRight: "0.5rem"
    },

    infoText: {
        paddingBottom: "1rem"

    }



}))


type ChangeOrderStatusModalProps = {
    anchorElOrderStatus: HTMLElement | null,
    setAnchorElOrderStatus: (value: React.SetStateAction<HTMLElement | null>) => void
    data: Order[],
    onSetOrderStatus: UseMutateAsyncFunction<Readonly<{
        transactionResults: TransactionResult[];
    }>, unknown, Readonly<{
        orderStatus: OrderStatus;
        orderIds: number[];
    }>, {}> | undefined

}

export default function ChangeOrderStatusModal({ anchorElOrderStatus, setAnchorElOrderStatus, onSetOrderStatus, data }: ChangeOrderStatusModalProps) {

    const { classes, cx } = useStyles()

    const [selectedValue, setSelectedValue] = useState<OrderStatus | "">('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value as OrderStatus);
    };

    const handleCloseOrderStatus = () => {
        setAnchorElOrderStatus(null);
    };

    const { l10n } = useAppLocalization()





    return (
        <StandardDialog maxWidthProp='md' onClose={handleCloseOrderStatus} open={Boolean(anchorElOrderStatus)}
            titleElement={<Typography variant='h3' sx={{ marginTop: "1.5rem", color: "black" }}>
                {l10n.getString("change-order-status")}
            </Typography>}
        >


            <RadioGroup
                defaultValue=""
                name="radio-buttons-group"
            >
                <Grid container direction="column" wrap="nowrap" rowGap={0} paddingX="1rem" className={classes.modalContainer}>

                    <ListItem onClick={() => setSelectedValue("RECEIVED")} className={classes.listItem} sx={{ background: selectedValue === "RECEIVED" ? highlightColor : "", borderTop: ".5px solid rgba(0, 0, 0, 0.12)" }}>

                        <Grid container gap={1.5}>
                            <FontAwesomeIcon icon={faInboxIn} style={{ color: "#64748b", }} size={"xl"} />
                            <Typography variant='body1'> {l10n.getString("change-order-status-received")}</Typography>
                        </Grid>



                        <Radio
                            checked={selectedValue === 'RECEIVED'}
                            onChange={handleChange}
                            value="RECEIVED"
                        />

                    </ListItem>

                    <ListItem onClick={() => setSelectedValue("CONFIRMED")} className={classes.listItem} sx={{ background: selectedValue === "CONFIRMED" ? highlightColor : "" }}>
                        <Grid container gap={1.5}>
                            <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#1993eb", }} size={"xl"} />
                            <Typography variant='body1'>{l10n.getString("change-order-status-confirmed")}</Typography>
                        </Grid>

                        <Radio
                            checked={selectedValue === 'CONFIRMED'}
                            onChange={handleChange}
                            value="CONFIRMED"
                        />
                    </ListItem>

                    <ListItem onClick={() => setSelectedValue("READY")} className={classes.listItem} sx={{ background: selectedValue === "READY" ? highlightColor : "" }}>

                        <Grid container gap={1.5}>
                            <FontAwesomeIcon icon={faInboxOut} style={{ color: "#1ab091", }} size={"xl"} />
                            <Typography variant='body1'>{l10n.getString("change-order-status-ready")}</Typography>
                        </Grid>

                        <Radio
                            checked={selectedValue === 'READY'}
                            onChange={handleChange}
                            value="READY"
                        />
                    </ListItem>


                    <ListItem onClick={() => setSelectedValue("CANCELLED")} className={classes.listItem} sx={{ background: selectedValue === "CANCELLED" ? highlightColor : "" }}>
                        <Grid container gap={1.5}>
                            <FontAwesomeIcon icon={faCircleX} style={{ color: "#ef4444", }} size={"xl"} />
                            <Typography variant='body1'>{l10n.getString("change-order-status-cancelled")}</Typography>
                        </Grid>

                        <Radio
                            checked={selectedValue === 'CANCELLED'}
                            onChange={handleChange}
                            value="CANCELLED"
                        />
                    </ListItem>

                    {selectedValue === "CANCELLED" && <TextField sx={{ marginTop: "1rem" }}
                        id="multiline"
                        label={l10n.getString("production-order-placeholder-comment")}
                        multiline
                        rows={4}
                        variant="outlined"
                    />}


                    <Grid container sx={{ paddingTop: "1rem" }}>

                        {selectedValue === 'RECEIVED' &&
                            <Grid container wrap='nowrap' paddingRight={"1.5rem"} paddingLeft={"1rem"}>
                                <FontAwesomeIcon icon={faCircleInfo} size="xl" className={classes.fontawesomeIcon} />
                                <Typography variant='caption' className={classes.infoText}>
                                    {l10n.getString("change-order-status-received-info-text")}
                                </Typography>
                            </Grid>
                        }


                        {selectedValue === 'CONFIRMED' &&

                            <Grid container wrap='nowrap' paddingRight={"1.5rem"} paddingLeft={"1rem"}>
                                <FontAwesomeIcon icon={faCircleInfo} size="xl" className={classes.fontawesomeIcon} />
                                <Typography variant='caption' className={classes.infoText}>
                                    {l10n.getString("change-order-status-confirmed-info-text")}
                                </Typography>
                            </Grid>
                        }

                        {selectedValue === 'READY' &&

                            <Grid container wrap='nowrap' paddingRight={"1.5rem"} paddingLeft={"1rem"}>
                                <FontAwesomeIcon icon={faCircleInfo} size="xl" className={classes.fontawesomeIcon} />
                                <Typography variant='caption' className={classes.infoText}>
                                    {l10n.getString("change-order-status-ready-info-text")}
                                </Typography>
                            </Grid>
                        }

                        {selectedValue === 'CANCELLED' &&
                            <Grid container wrap='nowrap' paddingRight={"1.5rem"} paddingLeft={"1rem"}>
                                <FontAwesomeIcon icon={faCircleInfo} size="xl" className={classes.fontawesomeIcon} />
                                <Typography variant='caption' className={classes.infoText}>
                                    {l10n.getString("change-order-status-cancelled-info-text")}
                                </Typography>
                            </Grid>
                        }
                    </Grid>

                    <Grid container direction="row" wrap='nowrap' gap={2} marginTop="1rem">
                        <StandardButton variant='outlined' color='error' onClick={() => handleCloseOrderStatus()}>{l10n.getString("confirmation-dialog-cancel")} </StandardButton>
                        <StandardButton color='black' onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            if (onSetOrderStatus) {
                                onSetOrderStatus({ orderStatus: selectedValue, orderIds: data.map((order) => order.id) })
                                handleCloseOrderStatus()
                            } else {
                                console.log("onSetOrderStatus was not added");
                            }
                        }
                        } >{l10n.getString("confirmation-dialog-approve")}</StandardButton>
                    </Grid>




                </Grid>
            </RadioGroup>




        </StandardDialog>
    )
}

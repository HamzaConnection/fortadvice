import { Grid, List, ListItem, Radio, RadioGroup, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { StandardDialog } from '../../../../../shared/components/dialogs/StandardDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleX, faInboxIn, faInboxOut } from '@fortawesome/pro-light-svg-icons';
import { useMemo, useState } from 'react';
import { Order, OrderStatus } from '../../../controlKitchenTypes';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { setOrderStatus, StandardTransactionResultResponse, TransactionResult } from '../productionApi';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { highlightColor } from '../../../../../shared/colors/Colors';
import { MRT_RowSelectionState } from 'material-react-table';
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { borderBottom } from '@mui/system';
import { useSnackbar } from 'notistack';
import { StandardChip } from '../../../../../shared/components/badges/StandardChip';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { useDateTime } from '../../../../localization/useDateTime';
import { ExportButtonResultModal } from './ExportButtonResultModal';
import { Player } from '@lottiefiles/react-lottie-player';
import lottieAnim from '../assets/checkmark-animation.json'


const useStyles = makeStyles()((theme) => ({

}))


type ChangeOrderStatusResponseModalProps = {
    data: StandardTransactionResultResponse | undefined,
    onClose: React.Dispatch<React.SetStateAction<Readonly<{
        transactionResults: TransactionResult[];
    }> | undefined>>

}

export default function StandardTransactionResultResponseModal({ data, onClose }: ChangeOrderStatusResponseModalProps) {

    const { classes, cx } = useStyles()
    const dateTimeFactory = useDateTime()
    const { l10n } = useAppLocalization()


    const failedActions = useMemo(() => {

        if (data) {
            return data.transactionResults.filter((result) => result.status.code >= 300).length
        } else {
            return 0
        }
    }
        , [data])


    console.log(failedActions);

    return (
        <StandardDialog maxWidthProp='lg' onClose={() => onClose(undefined)} open={Boolean(data)}
            titleElement={
                <Typography variant='h3' sx={{ marginTop: "1.5rem", color: "black" }}>
                    {l10n.getString("change-order-status-title")}
                </Typography>
            }
        >

            {failedActions > 0 && <Grid container justifyContent={"center"} sx={{ marginTop: "-4rem", marginBottom: "4rem" }} >
                <Typography> {failedActions} {failedActions === 1 ? l10n.getString("change-order-status-response-modal-error-aciton") : l10n.getString("change-order-status-response-modal-error-acitons")} {l10n.getString("change-order-status-response-modal-error")}</Typography>
            </Grid>}

            {failedActions === 0 &&
                <Grid container justifyContent={"center"} >
                    <Player src={lottieAnim} autoplay loop controls={false} style={{ width: "70%" }} />
                </Grid>

            }
            {failedActions > 0 &&
                <>
                    <Grid container item justifyContent={"end"} paddingRight={5} paddingBottom={2}>
                        <ExportButtonResultModal data={data} />
                    </Grid>
                    <Grid container justifyContent={"center"} paddingX={5} >

                        <Table>
                            <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                                <TableRow>
                                    <TableCell>
                                        {l10n.getString("change-order-status-response-modal-order-id")}
                                    </TableCell>
                                    <TableCell>
                                        {l10n.getString("change-order-status-response-modal-order-delivery")}
                                    </TableCell>
                                    <TableCell>
                                        {l10n.getString("change-order-status-response-modal-order-message")}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <>
                                    {data && data.transactionResults.map((result) => {

                                        return (
                                            <TableRow>
                                                <TableCell>
                                                    1233
                                                    {result.order.id}
                                                </TableCell>
                                                <TableCell>

                                                    {dateTimeFactory.formatDateTime(dateTimeFactory.fromApi(result.order.deliveryDetails.time))}
                                                </TableCell>
                                                <TableCell>
                                                    {result.status.code >= 300 ? <StandardChip label={result.status.text} variant='red' /> : result.status.text}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </>
                            </TableBody>
                        </Table>
                    </Grid>
                </>
            }

            <Grid container justifyContent={"center"}>
                <StandardButton onClick={() => onClose(undefined)} fullWidth={false} sx={{ width: 87, marginY: "2.5rem" }}>Luk</StandardButton>
            </Grid>


        </StandardDialog >
    )
}

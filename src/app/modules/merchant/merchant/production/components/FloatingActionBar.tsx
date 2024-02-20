
import { makeStyles } from 'tss-react/mui';
import { Button, Container, Divider, FormControlLabel, Grid, IconButton, Menu, MenuItem, Paper, Popover, Radio, RadioGroup, Tooltip, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowProgress, faCircleCheck, faCircleInfo, faCircleX, faFileArrowDown, faFileCsv, faFilePdf, faInboxIn, faInboxOut, faPrint } from '@fortawesome/pro-light-svg-icons';
import { faCircleXmark } from '@fortawesome/pro-thin-svg-icons';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { Order, OrderLine, OrderStatus } from '../../../controlKitchenTypes';
import { DateTime } from 'luxon';
import { useDateTime } from '../../../../localization/useDateTime';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';

import { printReceipt, saveReceiptAsFile, setOrderStatus, StandardTransactionResultResponse, TransactionResult } from '../productionApi';

import { useState } from 'react';
import { Box, fontSize } from '@mui/system';
import { useApiMutation } from '../../../../../core/api/useApiMutation';

import ChangeOrderStatusModal from './ChangeOrderStatusModal';
import { useExportOrdersToCsv } from './ExportFunctionOrder';
import { MRT_RowSelectionState } from 'material-react-table';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { UseMutateAsyncFunction } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import StandardTransactionResultResponseModal from './StandardTransactionResultResponseModal';
import { LoadingDialog } from '../../../../../shared/components/dialogs/LoadingDialog';
import LoadingLottie from "../assets/Loading-color-balls-jumping.json"
import { ConfirmModal } from '../../../../../shared/components/dialogs/ConfirmModal';



const useStyles = makeStyles()((theme) => ({
    floating: {
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        bottom: "55px",
        flexWrap: "nowrap",
        zIndex: 1
    },
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "80px",
        height: "100%",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        flexDirection: "column",
        flexWrap: 'nowrap',


    },
    number: {
        color: "white", background: "#2196F3",
        borderTopLeftRadius: ".5rem",
        borderBottomLeftRadius: ".5rem",
    },
    iconColor: {
        color: "#2196f3"
    },
    rounded: {
        borderTopRightRadius: ".5rem",
        borderBottomRightRadius: ".5rem"
    },
    popupPaper: {
        borderRadius: "10px",
    },
    menuItem: {
        padding: "0.7rem",
        fontSize: "14px"
    },
    button: {
        color: "black",
        textTransform: "none",
        fontWeight: "400"
    },

    modalContainer: {
        paddingBottom: theme.spacing(12),
        marginTop: "-1rem",

    },

}))


type FloatingActionBarProps = {
    data: Order[],
    startDate: DateTime,
    endDate: DateTime,
    setSelectedRows: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>
    onSetOrderStatus: UseMutateAsyncFunction<Readonly<{
        transactionResults: TransactionResult[];
    }>, unknown, Readonly<{
        orderStatus: OrderStatus;
        orderIds: number[];
    }>, {}>
}



export default function FloatingActionBar({ data, startDate, endDate, setSelectedRows, onSetOrderStatus: callSetOrderStatus }: FloatingActionBarProps) {
    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()


    const [anchorElExport, setAnchorElForExport] = useState<null | HTMLElement>(null);
    const openExport = Boolean(anchorElExport);
    const handleClickExport = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget);
        setAnchorElForExport(event.currentTarget);
    };
    const handleCloseExport = () => {
        setAnchorElForExport(null);
    };


    const [anchorElReceipt, setAnchorElForReceipt] = useState<null | HTMLElement>(null);
    const openReceipt = Boolean(anchorElReceipt);

    const handleClickReceipt = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget);
        setAnchorElForReceipt(event.currentTarget);
    };
    const handleCloseReceipt = () => {
        setAnchorElForReceipt(null);
    };





    const [anchorElOrderStatus, setAnchorElOrderStatus] = useState<null | HTMLElement>(null);

    const showOrderStatusModal = (event: React.MouseEvent<HTMLButtonElement>) => {

        setAnchorElOrderStatus(event.currentTarget);

    };


    const { mutateAsync: saveReceiptAsFileCall } = useApiMutation(saveReceiptAsFile, {})

    const handlePDFDownload = async () => {
        const response = await saveReceiptAsFileCall({ orderIds: data.map((order) => order.id) })
        let filename = `Gopay-Receipt-${startDate}_${endDate}.pdf`;
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
    }
    const { mutateAsync: callPrintReceipt } = useApiMutation(printReceipt, {

        async onSuccess(params, data, context) {
            enqueueSnackbar({
                variant: "success",
                message: l10n.getString("print-queued"),

            })
        },

    })


    const [orderStatusResponseResult, setOrderStatusResponseResult] = useState<StandardTransactionResultResponse>()
    const { mutateAsync: callRemovePrintReceiptfromQueue, isLoading } = useApiMutation(printReceipt, {

        baseURL: mockServerUrl,
        async onSuccess(params, data, context) {
            setOrderStatusResponseResult(data)
        },

    })

    const exportOrder = useExportOrdersToCsv({ data, startDate, endDate })

    const [showConfirmModalForRemoveQue, setShowConfirmModalForRemoveQue] = useState(false)
    const [showConfirmModalForPrint, setShowConfirmModalForPrint] = useState(false)

    return (
        <div className={classes.floating}>

            <Paper elevation={12} sx={{ width: "746px" }}>
                <Grid container gap={1.5} justifyContent="space-between" wrap="nowrap" className={cx(classes.rounded)}>
                    <Grid container item gap={1.5} wrap="nowrap" >
                        <Grid container item className={cx(classes.itemContainer, classes.number)} >
                            <Typography variant='h4'>{data.length > 99 ? "99+" : data.length}</Typography>
                        </Grid>
                        <Grid container item className={cx(classes.itemContainer)} >
                            <LocalizedStrict id="floating-action-button-picked">
                                <Typography color={"GrayText"} lineHeight={"1.3rem"}>
                                    Valgte emner
                                </Typography>
                            </LocalizedStrict>
                        </Grid>
                    </Grid>

                    <Grid container item gap={1.5} justifyContent="end" wrap="nowrap">
                        <Button className={cx(classes.button)} onClick={showOrderStatusModal} >
                            <Grid container direction={"column"} item className={cx(classes.itemContainer)} >
                                <FontAwesomeIcon icon={faArrowProgress} size="xl" className={classes.iconColor} />
                                <LocalizedStrict id="floating-action-button-order-status">
                                    <span style={{ whiteSpace: "nowrap" }}>Order status</span>
                                </LocalizedStrict>
                            </Grid>
                        </Button>


                        <Button className={cx(classes.button)} onClick={(e) => handleClickReceipt(e)} >
                            <Grid container direction={"column"} item className={cx(classes.itemContainer)}>
                                <FontAwesomeIcon icon={faPrint} size="xl" className={classes.iconColor} />
                                <LocalizedStrict id="floating-action-button-print">
                                    <span>Print</span>
                                </LocalizedStrict>
                            </Grid>
                        </Button>
                        <Popover
                            open={openReceipt}
                            anchorEl={anchorElReceipt}
                            onClose={handleCloseReceipt}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            slotProps={{ paper: { square: false, className: classes.popupPaper } }}
                        >
                            <Box sx={{ padding: "1rem" }}>
                                <MenuItem disabled={!data} onClick={(e) => {
                                    setShowConfirmModalForPrint(true)
                                    // callPrintReceipt({ orderIds: data.map((order) => order.id) })
                                }} className={classes.menuItem}>
                                    <FontAwesomeIcon icon={faPrint} size='xl' style={{ color: "#2196F3", paddingRight: "0.5rem" }} />
                                    {l10n.getString("export-button-print")}
                                </MenuItem>

                                <MenuItem disabled={!data} onClick={() => {
                                    setShowConfirmModalForRemoveQue(true)
                                    //callRemovePrintReceiptfromQueue({ orderIds: data.map((order) => order.id) })
                                }}
                                    className={classes.menuItem}>
                                    <FontAwesomeIcon icon={faCircleX} size='xl' style={{ color: "#2196F3", paddingRight: "0.5rem" }} />
                                    {l10n.getString("export-button-remove-print")}
                                </MenuItem>
                            </Box>

                        </Popover>


                        <Button className={cx(classes.button)} onClick={handleClickExport} >
                            <Grid container item className={cx(classes.itemContainer)}>
                                <FontAwesomeIcon icon={faFileArrowDown} size="xl" className={classes.iconColor} />
                                <LocalizedStrict id="export-button-export-text">
                                    <span>Eksport</span>
                                </LocalizedStrict>
                            </Grid>
                        </Button>


                        <Popover
                            open={openExport}
                            anchorEl={anchorElExport}
                            onClose={handleCloseExport}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            slotProps={{ paper: { square: false, className: classes.popupPaper } }}
                        >
                            <Box sx={{ padding: "1rem" }}>
                                <MenuItem disabled={!data} onClick={() => handlePDFDownload()} className={classes.menuItem}>
                                    <FontAwesomeIcon icon={faFilePdf} size="xl" style={{ color: "#2196F3", paddingRight: "0.5rem" }} />
                                    {l10n.getString("export-button-export-as-pdf")}
                                </MenuItem>

                                <MenuItem disabled={!data} onClick={() => exportOrder()} className={classes.menuItem}>
                                    <FontAwesomeIcon icon={faFileCsv} size="xl" style={{ color: "#2196F3", paddingRight: "0.5rem" }} />
                                    {l10n.getString("export-button-export-as-csv")}
                                </MenuItem>
                            </Box>
                        </Popover>

                        <Tooltip title={l10n.getString("floating-action-button")}>
                            <Grid alignContent={"center"} container item className={cx(classes.itemContainer)} sx={{ borderLeft: "1px solid #C0C0C0" }}>
                                <IconButton sx={{ fontSize: "1rem" }} onClick={() => setSelectedRows({})} >
                                    <FontAwesomeIcon icon={faCircleXmark} size="xl" style={{ color: "#94a3b8", }} />
                                </IconButton>
                            </Grid>
                        </Tooltip >
                    </Grid>
                </Grid >
            </Paper>

            <ChangeOrderStatusModal anchorElOrderStatus={anchorElOrderStatus} setAnchorElOrderStatus={setAnchorElOrderStatus} data={data} onSetOrderStatus={callSetOrderStatus} />


            {orderStatusResponseResult && <StandardTransactionResultResponseModal onClose={setOrderStatusResponseResult} data={orderStatusResponseResult} />}

            <ConfirmModal domainTitle={l10n.getString("export-button-remove-print")} buttonLabelSubmit={l10n.getString("yes")} open={showConfirmModalForRemoveQue} onClose={() => setShowConfirmModalForRemoveQue(false)} handleClick={() => callRemovePrintReceiptfromQueue({ orderIds: data.map((order) => order.id) })} />

            <ConfirmModal domainTitle={l10n.getString("export-button-print")} buttonLabelSubmit={l10n.getString("yes")} open={showConfirmModalForPrint} onClose={() => setShowConfirmModalForPrint(false)} handleClick={() => callPrintReceipt({ orderIds: data.map((order) => order.id) })} />

            <LoadingDialog loading={isLoading} lottieAnim={LoadingLottie} />
        </div >

    )
}

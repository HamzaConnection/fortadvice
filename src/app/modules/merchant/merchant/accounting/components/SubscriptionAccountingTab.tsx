import { Grid, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { MRT_ColumnDef, MRT_FullScreenToggleButton, MRT_RowSelectionState, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { AcceptTermsCheckbox } from '../../../../../shared/components/checkbox/AcceptTermsCheckbox';
import { ConfirmModal } from '../../../../../shared/components/dialogs/ConfirmModal';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { SecondaryCellText } from '../../../../../shared/components/table/SecondaryCellText';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable';
import { useDateTime } from '../../../../localization/useDateTime';
import { Receipt, ReceiptDialog } from '../../../../receipt/pages/ReceiptDialog';
import { useAppSelector } from '../../../../store/storeHooks';
import { Order } from '../../../controlKitchenTypes';
import { useExportSubscriptionToCsv } from '../../production/components/ExportFunctionSubscription';
import { SelectCustomer } from '../../production/components/SelectCustomer';
import { SelectShop } from '../../production/components/SelectShop';
import { fetchAllShops } from '../../production/productionApi';
import { cancelSubscription, fetchSubscriptionByPeriod, Subscription, SubscriptionReport } from '../accountingApi';


type SubscriptionAccountingTabProps = Readonly<{

}>


const useStyles = makeStyles()((theme) => ({
    dateFilter: {
        width: "11rem"
    }
}))

export function SubscriptionAccountingTab({ }: SubscriptionAccountingTabProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})
    const [receipt, setReceipt] = useState<Receipt>()
    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [endDate, setEndDate] = useState<DateTime>(DateTime.now())

    const [shopId, setShopId] = useState<string>()
    const [customerId, setCustomerId] = useState<string>()
    const [customerGroupId, setCustomerGroupId] = useState<string>()

    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmModalText, setConfirmModalText] = useState("")
    const [ignoreTerms, setIgnoreTerms] = useState(false)
    const [orderId, setOrderId] = useState<number>()


    const { enqueueSnackbar } = useSnackbar()



    const columns = useMemo<MRT_ColumnDef<Subscription>[]>(
        () => [{
            header: l10n.getString("accounting-subscription-title"),
            accessorKey: 'name',
        },
        {
            header: l10n.getString("accounting-subscription-name"),
            accessorKey: 'subscriptionDetails.customer',
            Cell: ({ row }) => {
                return (
                    <>
                        <p>
                            {row.original?.subscriptionDetails.customer?.displayName}
                        </p>
                        {row.original.subscriptionDetails.customer?.email && row.original.subscriptionDetails.customer?.employeeId &&
                            <SecondaryCellText text={row.original.subscriptionDetails.customer?.employeeId} text2={row.original.subscriptionDetails.customer?.email} tooltipTitle={l10n.getString("employee-id")} />
                        }
                    </>
                )
            },
            minSize: 40, //allow columns to get smaller than default
            maxSize: 500, //allow columns to get larger than default
            size: 350, //make columns wider by default
        },
        {
            header: l10n.getString("accounting-subscription-subscribed"),
            id: "subscriptionDetails.validFrom",
            Cell: ({ row }) => {
                return <span>{dateTimeFactory.formatDate(dateTimeFactory.fromApi(row.original.subscriptionDetails.validFrom))}</span>
            },

        },
        {
            header: l10n.getString("accounting-subscription-unsubscribed"),
            id: "subscriptionDetails.validTo",
            Cell: ({ row }) => {
                if (row.original.subscriptionDetails.validTo) {
                    return <span>{dateTimeFactory.formatDate(dateTimeFactory.fromApi(row.original.subscriptionDetails.validTo))}</span>
                }
                return <span></span>
            },
        },
        {
            header: l10n.getString("accounting-subscription-payment-method"),
            accessorKey: "subscriptionDetails.paymentDetails.method",
            Cell: ({ cell }) => {
                return <p style={{ inlineSize: "8rem", overflowWrap: "break-word" }}>
                    {cell.getValue() == undefined ? "" : l10n.getStringForEnum("purchases-payment-method", cell.getValue() as string, cell.getValue() as string)}
                </p>
            }
        },
        {
            header: l10n.getString("accounting-subscription-amount"),
            accessorKey: "subscriptionDetails.amount",
            accessorFn: (row) => moneyFactory.format(toDinero(row.subscriptionDetails.amount)),
            muiTableHeadCellProps: {
                align: 'right',
            },
            muiTableBodyCellProps: {
                align: 'right',
            },
        },


        ], []
    );


    const subscriptionReport = useApiQuery(fetchSubscriptionByPeriod, {
        queryName: "get-all-subscription",
        dependencies: {
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate(),
            merchantId: merchantId ?? 0,
            shopId: shopId,
            customerId: customerId,
            customerGroupId: customerGroupId,
        },
        enabled: Boolean(merchantId)
    })

    const tableData = useMemo(() => {
        return subscriptionReport.data?.subscriptions
    }, [subscriptionReport.data])


    const allShops = useApiQuery(fetchAllShops, {
        queryName: "get-all-shops",
        dependencies: {
            startDate: startDate,
            endDate: endDate,
            merchantId: merchantId ?? 0
        },
        enabled: Boolean(merchantId),
    })


    function showReceipt(row: Order | {
        id: number;
        uid: string;
        orderType: string;
    }) {
        setReceipt({
            orderId: row.id,
            orderUid: row.uid,
            orderType: row.orderType,
        })
    }

    const exportSubscription = useExportSubscriptionToCsv({ data: subscriptionReport.data?.subscriptions, startDate, endDate })


    const { mutateAsync: callCancelSubscription } = useApiMutation(cancelSubscription, {
        async onSuccess(params, data, context) {
            enqueueSnackbar({
                variant: "success",
                message: l10n.getString("accounting-subscription-cancel-true"),
            })
        },

    })




    return (
        <>

            <PageHeader title={l10n.getString("accounting-tab-subscription")} page={Page.ACCOUNTING_SUBSCRIPTION}></PageHeader>



            <Grid paddingTop="3rem" >

                <LocalizedMaterialReactTable
                    columns={columns}
                    data={tableData ?? []}
                    defaultColumn={{
                        minSize: 5, //allow columns to get smaller than default
                        maxSize: 5, //allow columns to get larger than default
                        size: 5, //make columns wider by default
                    }}


                    enableClickToCopy={false}
                    enableColumnOrdering
                    enableStickyHeader
                    enableDensityToggle={false}
                    initialState={{ density: 'spacious' }}
                    enableHiding={false}
                    enableRowActions
                    enableGrouping
                    muiTableContainerProps={{ sx: { maxHeight: "100%" } }}
                    positionActionsColumn="last"
                    enableColumnDragging={false}
                    renderRowActionMenuItems={({ row, closeMenu }) => [

                        (
                            <MenuItem onClick={() => {
                                showReceipt(row.original.subscriptionDetails.order)
                                closeMenu()
                            }}>
                                {l10n.getString("office-purchase-receipt")}
                            </MenuItem>

                        ),
                        (
                            <MenuItem onClick={(event) => {

                                setShowConfirmModal(true)
                                setOrderId(row.original.subscriptionDetails.order.id)
                                console.log(row.original.subscriptionDetails.order.id);
                                setConfirmModalText(`${row.original.name} ${l10n.getString("for")} ${row.original.subscriptionDetails.customer.displayName}`)
                            }}>
                                {l10n.getString("accounting-subscription-cancel")}
                            </MenuItem>
                        ),
                    ]}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderToolbarInternalActions={({ table }) => (
                        <Grid container paddingTop="1rem" wrap='nowrap'>
                            <StandardExportButton onClick={() => {
                                exportSubscription()
                            }} />
                            <MRT_ToggleGlobalFilterButton table={table} />
                            <MRT_FullScreenToggleButton table={table} />
                        </Grid>
                    )}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Grid container direction={'column'} width="100%">
                            <Grid container wrap='nowrap' justifyContent="start" alignItems="center" paddingY="1rem" marginLeft={"1rem"} gap={"2%"}>
                                <DatePicker
                                    className={classes.dateFilter}
                                    value={startDate}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setStartDate(newValue)
                                        }
                                    }}
                                    label={l10n.getString("office-start-date")}

                                />
                                <DatePicker
                                    className={classes.dateFilter}
                                    value={endDate}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            setEndDate(newValue)
                                        }
                                    }}
                                    label={l10n.getString("office-end-date")}
                                />

                                <SelectShop shops={allShops.data?.shops ?? []} setShopId={setShopId} />

                                <SelectCustomer setCustomerId={setCustomerId} setCustomerGroupId={setCustomerGroupId} />

                            </Grid>
                        </Grid>
                    )}

                    state={{
                        isLoading: subscriptionReport.isLoading,
                        showProgressBars: subscriptionReport.isFetching,
                    }}
                />
            </Grid >

            {showConfirmModal && <ConfirmModal buttonLabelSubmit={l10n.getString("delete-news-modal-button-delete-label")} domainTitle={l10n.getString("accounting-subscription-cancel")} subject={confirmModalText} handleClick={() => callCancelSubscription({ orderId: orderId, ignoreTerms })
            } open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>

                <AcceptTermsCheckbox accepted={ignoreTerms} setAccepted={setIgnoreTerms} termsText={l10n.getString("accounting-subscription-terms")} />





            </ConfirmModal>

            }


            {
                receipt && (
                    <ReceiptDialog
                        receipt={receipt}
                        open={receipt !== undefined}
                        onClose={() => setReceipt(undefined)}
                    />
                )
            }
        </>
    )
}



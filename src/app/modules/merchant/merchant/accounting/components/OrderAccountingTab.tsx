import { Grid, MenuItem, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_FullScreenToggleButton, MRT_RowSelectionState, MRT_TableInstance, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { SecondaryCellText } from '../../../../../shared/components/table/SecondaryCellText';
import { toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable';
import { useDateTime } from '../../../../localization/useDateTime';
import { Receipt, ReceiptDialog } from '../../../../receipt/pages/ReceiptDialog';
import { useAppSelector } from '../../../../store/storeHooks';
import { Order } from '../../../controlKitchenTypes';
import ChangeOrderStatusModal from '../../production/components/ChangeOrderStatusModal';
import FloatingActionBar from '../../production/components/FloatingActionBar';
import { SelectCustomer } from '../../production/components/SelectCustomer';
import { SelectShop } from '../../production/components/SelectShop';
import { TableToolbarBanner } from '../../production/components/TableToolbarBanner';
import { fetchAllShops, fetchOrdersByPeriod, setOrderStatus, StandardTransactionResultResponse } from '../../production/productionApi';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { useExportOrdersToCsv } from '../../production/components/ExportFunctionOrder';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { fetchAccountingOrdersByPeriod } from '../accountingApi';
import StandardTransactionResultResponseModal from '../../production/components/StandardTransactionResultResponseModal';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { enqueueSnackbar } from 'notistack';
import { LoadingDialog } from '../../../../../shared/components/dialogs/LoadingDialog';
import LoadingLottie from "../assets/Loading-color-balls-jumping.json"


const useStyles = makeStyles()((theme) => ({
    dateFilter: {
        width: "11rem"
    }
}))


type OrderAccountingTabProps = Readonly<{

}>

export function OrderAccountingTab({ }: OrderAccountingTabProps) {
    const { classes } = useStyles()

    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [endDate, setEndDate] = useState<DateTime>(DateTime.now())
    const [receipt, setReceipt] = useState<Receipt>()
    const moneyFactory = useMoney({})
    const dateTimeFactory = useDateTime()
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({})
    const [isCancelled, setIsCancelled] = useState(false)
    const [showNotPrintedOrders, setShowNotPrintedOrders] = useState(false)
    const [shopId, setShopId] = useState<string>()
    const [customerId, setCustomerId] = useState<string>()
    const [customerGroupId, setCustomerGroupId] = useState<string>()
    const [anchorElOrderStatus, setAnchorElOrderStatus] = useState<null | HTMLElement>(null);

    const { l10n } = useAppLocalization()
    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const columns = useMemo<MRT_ColumnDef<Order>[]>(
        () => [
            {
                header: l10n.getString("production-order-number"),
                accessorKey: 'id',
            },
            {
                header: l10n.getString("production-order-time"),
                accessorKey: 'created',
                Cell: ({ row }) => {
                    return <span>{dateTimeFactory.formatDateTime(dateTimeFactory.fromApi(row.original.created))}</span>
                },

            },
            {
                header: l10n.getString("office-purchase-name"),
                accessorKey: 'customer.displayName',
                Cell: ({ row }) => {
                    return (
                        <>
                            <p>
                                {row.original?.customer?.displayName}
                            </p>
                            {row.original.customer?.email && row.original.customer?.employeeId &&
                                <SecondaryCellText text={row.original.customer?.employeeId} text2={row.original.customer?.email} tooltipTitle={l10n.getString("employee-id")} />
                            }
                        </>
                    )
                },
                minSize: 40, //allow columns to get smaller than default
                maxSize: 500, //allow columns to get larger than default
                size: 350, //make columns wider by default

            },
            {
                header: l10n.getString('office-purchase-payment-details'),
                accessorKey: 'paymentDetails.method',
                Cell: ({ cell }) => {
                    return <p style={{ inlineSize: "8rem", overflowWrap: "break-word" }}>
                        {cell.getValue() == undefined ? "" : l10n.getStringForEnum("purchases-payment-method", cell.getValue() as string, cell.getValue() as string)}
                    </p>
                }
            },
            {
                header: l10n.getString('office-purchase-amount'),
                id: "amount",
                accessorFn: (row) => moneyFactory.format(toDinero(row.amount)),
                muiTableHeadCellProps: {
                    align: 'right',
                },
                muiTableBodyCellProps: {
                    align: 'right',
                },
            },
        ],
        [],
    );

    function showReceipt(row: Order) {
        setReceipt({
            orderId: row.id,
            orderUid: row.uid,
            orderType: row.orderType,
        })
    }

    const [selectedRows, setSelectedRows] = useState<Order[]>()
    const tableInstanceRef = useRef<MRT_TableInstance<Order>>(null);

    useEffect(() => {
        if (Object.keys(rowSelection).length > 0) {
            setSelectedRows(tableInstanceRef.current?.getSelectedRowModel().rows.map((row) => row.original))
        } else {
            setSelectedRows(undefined)
        }

    }, [rowSelection])




    const orderList = useApiQuery(fetchAccountingOrdersByPeriod, {
        queryName: "get-all-accounting-orders-by-period",
        dependencies: {
            merchantId: merchantId ?? 0,
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate(),
            shopId: shopId,
            customerId: customerId,
            customerGroupId: customerGroupId,
            isCancelled: isCancelled,
        },
        enabled: Boolean(merchantId),
    })




    // const refundOrderCall = useApiMutation(refundOrder, {
    // })





    const tableData = useMemo(() => {
        try {
            if (orderList.data?.orders && showNotPrintedOrders) {
                const printedOrders = orderList.data.orders.filter((order => {
                    return order.printDetails?.isPrinted == false
                }))
                return printedOrders
            } else {
                return orderList.data?.orders
            }


        } catch (error: any) {
            // TODO test if you still need this since it's handled globally
            return []
        }

    }, [orderList.data, showNotPrintedOrders])





    const hasNonePrinted = () => {
        if (tableData) {
            return tableData.filter((order) => { return order.printDetails?.isPrinted === false }).length > 0
        } else {
            false
        }

        return false

    }

    const showAlertBanner = useMemo(() =>
        hasNonePrinted(), [tableData])


    const allShops = useApiQuery(fetchAllShops, {
        queryName: "get-all-shops",
        dependencies: {
            merchantId: merchantId ?? 0,
            startDate: startDate,
            endDate: endDate,
            // Ask søren why it can be null
        },
        enabled: Boolean(merchantId),
    })


    const exportOrder = useExportOrdersToCsv({ data: orderList.data?.orders, startDate, endDate })

    /// response modal
    const [orderStatusResponseResult, setOrderStatusResponseResult] = useState<StandardTransactionResultResponse>()
    const { mutateAsync: callSetOrderStatus, isLoading } = useApiMutation(setOrderStatus, {
        baseURL: mockServerUrl,
        async onSuccess(params, data, context) {
            setOrderStatusResponseResult(data)
        },
        async onError(params, error, context) {
            let message = "Unknown error"
            if (typeof error === "string") message = error
            if (error instanceof Error) message = error.message
            enqueueSnackbar({
                variant: "error",
                message: `An error occurred: ${message}`
            })
        },
    })



    return (
        <>

            <PageHeader title={l10n.getString('production-order')} page={Page.ACCOUNTING_ORDER}></PageHeader>


            <Grid paddingTop="3rem" >
                {showAlertBanner && <TableToolbarBanner showNotPrintedOrders={showNotPrintedOrders} setShowNotPrintedOrders={setShowNotPrintedOrders} />}

                <LocalizedMaterialReactTable
                    tableInstanceRef={tableInstanceRef}
                    columns={columns}
                    data={tableData ?? []}
                    defaultColumn={{
                        minSize: 5, //allow columns to get smaller than default
                        maxSize: 5, //allow columns to get larger than default
                        size: 5, //make columns wider by default
                    }}
                    onColumnFiltersChange={setColumnFilters}
                    onRowSelectionChange={setRowSelection}
                    enableRowSelection
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
                                showReceipt(row.original)
                                closeMenu()
                            }}>
                                {l10n.getString("office-purchase-receipt")}
                            </MenuItem>
                        ),
                        (<MenuItem onClick={(event) => {
                            row.toggleSelected(true)
                            setAnchorElOrderStatus(event.currentTarget)
                            closeMenu()
                        }}>
                            {l10n.getString("floating-action-button-order-status-menu-item")}
                        </MenuItem>
                        )
                    ]}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderToolbarInternalActions={({ table }) => (
                        <Grid paddingTop={"1rem"}>
                            <StandardExportButton onClick={() => {
                                exportOrder()
                            }} />
                            <MRT_ToggleGlobalFilterButton table={table} />
                            <MRT_FullScreenToggleButton table={table} />
                        </Grid>
                    )}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Grid container direction={'column'} width="80%">
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

                                {/* <Grid >
                                    <FormControlLabel control={<Switch checked={isCancelled} onClick={() => setIsCancelled(!isCancelled)} />} label={l10n.getString("production-order-show-cancelled")} />
                                </Grid> */}

                            </Grid>
                        </Grid>
                    )}

                    state={{
                        columnFilters,
                        rowSelection,
                        isLoading: orderList.isLoading,
                        showProgressBars: orderList.isFetching,
                    }}
                />
            </Grid >
            {selectedRows && <FloatingActionBar data={selectedRows} startDate={startDate} endDate={endDate} setSelectedRows={setRowSelection} onSetOrderStatus={callSetOrderStatus} />}
            {
                receipt && (
                    <ReceiptDialog
                        receipt={receipt}
                        open={receipt !== undefined}
                        onClose={() => setReceipt(undefined)}
                    />
                )
            }
            {selectedRows && <ChangeOrderStatusModal onSetOrderStatus={callSetOrderStatus} anchorElOrderStatus={anchorElOrderStatus} setAnchorElOrderStatus={setAnchorElOrderStatus} data={selectedRows} />}

            {orderStatusResponseResult && <StandardTransactionResultResponseModal onClose={setOrderStatusResponseResult} data={orderStatusResponseResult} />}
            <LoadingDialog loading={isLoading} lottieAnim={LoadingLottie} />

        </>
    )
}

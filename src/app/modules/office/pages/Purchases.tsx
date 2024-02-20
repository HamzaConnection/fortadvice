import { useEffect, useMemo, useState } from 'react';
import { MRT_FullScreenToggleButton, MRT_Row, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';
import { Alert, Grid, IconButton, MenuItem, Snackbar, Tooltip, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fetchPurchasesByPeriod, TableOrder } from '../purchasesApi';
import { DateTime } from 'luxon';
import { MoneyFactory, useMoney } from '../../../modules/currency/useMoney';
import { toCurrency, toDinero, toDineroOrUndefined } from '../../../modules/currency/currencyLib';
import { add, dinero } from 'dinero.js';
import { Receipt, ReceiptDialog } from '../../../modules/receipt/pages/ReceiptDialog';
import { DateTimeFactory, useDateTime } from '../../../modules/localization/useDateTime';
import { Box } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/pro-light-svg-icons';
import { useApiQuery } from '../../../core/api/useApiQuery';
import { DropdownExportButtonPurchases } from '../components/DropdownExportButtonPurchases';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { useAppSelector } from '../../store/storeHooks';
import { selectUserGroupId } from '../../login/loginSelectors';
import { LocalizedMaterialReactTable } from '../../localization/components/LocalizedMaterialReactTable';
import { selectEffectiveCompanyId } from '../../context/contextSelectors';



export const Purchases = () => {
    const moneyFactory: MoneyFactory = useMoney({})
    const dateTimeFactory: DateTimeFactory = useDateTime()
    const companyId = useAppSelector(selectEffectiveCompanyId)
    const userGroupId = useAppSelector(selectUserGroupId)

    const { l10n } = useAppLocalization()


    const [startDate, setStartDate] = useState<DateTime | null>(DateTime.now().minus({ days: 14 }));
    const [chosenStartDate, setChosenStartDate] = useState<string>(DateTime.now().toISODate());

    const [endDate, setEndDate] = useState<DateTime | null>(DateTime.now());
    const [chosenEndDate, setChosenEndDate] = useState<string>(DateTime.now().toISODate());

    const [receipt, setReceipt] = useState<Receipt>()

    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")

    const getTotalFilteredRowAmount = (data: MRT_Row<TableOrder>[]) => {
        const totalTransactions = data.length

        const currency = toCurrency("DKK")  // TODO: Take from input data
        const zero = dinero({ amount: 0, scale: 2, currency })
        const total = data.reduce((acc, row) => {
            const rowValue = toDineroOrUndefined(row?.original?.amount) ?? zero
            return add(acc, rowValue)
        }, zero);



        return (
            <>
                <LocalizedStrict id='office-period-total' vars={{ periodTotal: moneyFactory.format(total) }}>
                    <p>{"Total for period: " + moneyFactory.format(total)}</p>
                </LocalizedStrict>
                <LocalizedStrict id='office-transation-period-total' vars={{ transactionPeriodTotal: totalTransactions }}>
                    <p>{"Total transations for period: " + totalTransactions}</p>
                </LocalizedStrict>
            </>
        )
    };

    function showReceipt(row: TableOrder) {
        setReceipt({
            orderId: row.id,
            orderUid: row.uid,
            orderType: row.orderType,
        })
    }

    const lastUpdatedTime = () => {

        const timeInMS = queryResult.dataUpdatedAt;
        const dateTime = DateTime.fromMillis(timeInMS)
        return dateTime.toLocaleString(DateTime.TIME_WITH_SECONDS)

    }

    const queryResult = useApiQuery(fetchPurchasesByPeriod, {
        queryName: "purchases-by-period",
        dependencies: {
            companyId: companyId ?? 0,
            userGroupId: userGroupId ?? 0,
            startDate: chosenStartDate,
            endDate: chosenEndDate
        },
        enabled: companyId !== undefined && userGroupId !== undefined && startDate !== null && endDate !== null
    })

    const tableData = useMemo(() => {
        try {
            if (queryResult.data) {
                const data = queryResult.data
                return data.orders.map((order) => ({
                    ...order,
                    startDate: data.reportDetails.startDate,
                    endDate: data.reportDetails.endDate
                }))
            }

            return []

        } catch (error: any) {
            // TODO test if you still need this since it's handled globally
            setErrorMessage(error.displayMessage)
            setShowErrorToaster(true)
            return []
        }

    }, [queryResult.data])



    const columns = useMemo<MRT_ColumnDef<TableOrder>[]>(
        () => [
            {
                header: l10n.getString("office-purchase-time"),
                accessorKey: 'created',
            },
            {
                header: l10n.getString("office-purchase-name"),
                accessorKey: 'customer.displayName',
                minSize: 40, //allow columns to get smaller than default
                maxSize: 500, //allow columns to get larger than default
                size: 300, //make columns wider by default

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
                accessorId: "amount",
                accessorFn: (row) => moneyFactory.format(toDinero(row.amount)),
                Footer: ({ table }) =>
                (<>
                    {
                        (getTotalFilteredRowAmount(table.getFilteredRowModel().rows as MRT_Row<TableOrder>[]))
                    }
                </>),
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

    useEffect(() => {
        if (startDate !== null && endDate !== null) {
            setChosenStartDate(startDate.toISODate())
            setChosenEndDate(endDate.toISODate())
        }
    }, [])

    return (
        <>
            <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                    severity="error" variant="filled">{errorMessage}
                </Alert>
            </Snackbar>


            <Grid paddingTop="3rem" >
                <LocalizedMaterialReactTable
                    columns={columns}
                    data={tableData}
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
                    renderRowActionMenuItems={({ row, closeMenu }) => [(
                        <LocalizedStrict id="office-purchase-receipt">
                            <MenuItem onClick={() => {
                                showReceipt(row.original)
                                closeMenu()
                            }}>
                                Receipt
                            </MenuItem>
                        </LocalizedStrict>
                    )]}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderToolbarInternalActions={({ table }) => (
                        <>
                            <Box sx={{ marginRight: "1rem", whiteSpace: "nowrap" }}>
                                <LocalizedStrict id="office-last-updated" vars={{ lastUpdated: lastUpdatedTime() }}>
                                    <Typography variant="caption" color="text.secondary">Last updated: {lastUpdatedTime()}</Typography>
                                </LocalizedStrict>
                                <Tooltip title={l10n.getString("office-refresh")}>
                                    <IconButton onClick={() => queryResult.refetch()}>
                                        <FontAwesomeIcon size='xs' icon={faArrowRotateRight} style={{ whiteSpace: "nowrap" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <DropdownExportButtonPurchases rowsIsSelected={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} containsRows={table.getPrePaginationRowModel().rows.length === 0}
                                allRowsWithFilter={table.getPrePaginationRowModel().rows}
                                seletecRows={table.getSelectedRowModel().rows}
                                chosenStartDate={chosenStartDate}
                                chosenEndDate={chosenEndDate}
                            />
                            <MRT_ToggleGlobalFilterButton table={table} />
                            <MRT_FullScreenToggleButton table={table} />
                        </>
                    )}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Grid container direction={'column'} width="80%">
                            <Grid container justifyContent="start" alignItems="center" paddingBottom="1rem" marginLeft="1rem">
                                <DatePicker
                                    sx={{ width: "9rem", marginRight: "2rem", marginBottom: "1rem" }}
                                    value={startDate}
                                    onChange={(newValue) => setStartDate(newValue)}
                                    onAccept={(newValue) => setChosenStartDate(newValue?.toISODate() ?? "")}
                                    label={l10n.getString("office-start-date")}
                                    slotProps={{ textField: { variant: "standard", size: "small" } }}
                                />
                                <DatePicker
                                    sx={{ width: "9rem", marginBottom: "1rem" }}
                                    value={endDate}
                                    onChange={(newValue) => setEndDate(newValue)}
                                    onAccept={(newValue) => setChosenEndDate(newValue?.toISODate() ?? "")}
                                    label={l10n.getString("office-end-date")}
                                    slotProps={{ textField: { variant: "standard", size: "small" } }}
                                />
                            </Grid>
                        </Grid>
                    )}
                    state={{
                        isLoading: queryResult.isLoading,
                        showProgressBars: queryResult.isFetching,
                    }}
                />
            </Grid >
            {receipt && (
                <ReceiptDialog
                    receipt={receipt}
                    open={receipt !== undefined}
                    onClose={() => setReceipt(undefined)}
                />
            )}
        </>
    )
}


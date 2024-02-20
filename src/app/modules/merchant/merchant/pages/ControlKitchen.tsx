import { useCallback, useEffect, useMemo, useState } from 'react'
import { MRT_ColumnFiltersState, MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton } from 'material-react-table'
import type { MRT_ColumnDef } from 'material-react-table'
import { Alert, Chip, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, Tooltip, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useApiQuery } from '../../../../core/api/useApiQuery'
import { DateTime } from 'luxon'
import { useMoney } from '../../../currency/useMoney'
import { Receipt, ReceiptDialog } from '../../../receipt/pages/ReceiptDialog'
import { KitchenTableOrder, fetchKitchenPurchasesByPeriod } from '../../controlKitchenApi'
import { useDateTime } from '../../../localization/useDateTime'
import { DropdownExportButtonControlKitchen } from '../components/DropdownExportButtonControlKitchen'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateRight, faFileChartColumn } from '@fortawesome/pro-light-svg-icons'
import { Box } from '@mui/system'
import { LocalizedEnum, LocalizedStrict } from '../../../localization/components/AppLocalized'
import { useAppLocalization } from '../../../localization/components/AppLocalizationProvider'
import { makeStyles } from 'tss-react/mui'
import { useAppSelector } from '../../../store/storeHooks'
import { LocalizedMaterialReactTable } from '../../../localization/components/LocalizedMaterialReactTable'
import { toDinero } from '../../../currency/currencyLib'
import { faClock } from '@fortawesome/pro-light-svg-icons'
import { createEnumChecker, iterateStringEnum } from '../../../../lib/enums'
import { UnreachableCaseError } from '../../../../lib/lang'
import { PageHeader } from '../../../../shared/components/pageHeader/PageHeader'
import { Page } from '../../../../shared/components/pageHeader/PageHeaderApi'
import { SelectControlKitchenMode } from '../components/SelectControlKitchenMode'
import { LocalCache, StorageKey } from '../../../../shared/cache/LocalCache'
import { StandardTimePicker } from '../../../../shared/components/pickers/StandardTimePicker'
import BooleanBadge from '../../../../shared/components/badges/BooleanBadge'
import { selectEffectiveCompanyId } from '../../../context/contextSelectors'

enum CheckInFilter {
    ALL = "ALL",
    CHECKED_IN = "CHECKED_IN",
    NOT_CHECKED_IN = "NOT_CHECKED_IN",
}

const isCheckInFilter = createEnumChecker(CheckInFilter)

const useStyles = makeStyles()((theme) => ({
    dateFilter: {
        width: "auto",
        maxWidth: "9rem",
    },
    timeFilter: {
        width: "auto",
        maxWidth: "8rem",

    },
    checkInStatusFilter: {
        minWidth: "8.5rem",
    },
    customerName: {
        inlineSize: "8rem",
        overflowWrap: "break-word",
    },
    checkedInStatus: {
        borderRadius: theme.shape.borderRadius * 2,
    },
    totalItems: {
        marginRight: theme.spacing(0.5),
        padding: theme.spacing(0.25, 0.5),
        border: `1px solid ${theme.palette.text.secondary}`,
        borderRadius: theme.shape.borderRadius,
    },
    timePickerIconButton: {
        "& .MuiSvgIcon-root": {
            fontSize: "1.3rem"
        }
    }
}))

export type ControlKitchenMode = "DELIVERY_TIME" | "PURCHASE_TIME";


export function ControlKitchen() {
    const { classes } = useStyles()

    const moneyFactory = useMoney({})
    const dateTimeFactory = useDateTime()
    const { l10n } = useAppLocalization()

    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [receipt, setReceipt] = useState<Receipt>()

    const [fromDateTime, setFromDateTime] = useState<DateTime>(startDate.minus({ minute: 5 }))
    const [toDateTime, setToDateTime] = useState<DateTime>(startDate.plus({ minute: 15 }))

    const [checkInFilter, setCheckInFilter] = useState(CheckInFilter.ALL)

    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([])

    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")

    const [mode, setMode] = useState<ControlKitchenMode>(LocalCache().get(StorageKey.CONTROL_KITCHEN_MODE) as ControlKitchenMode ?? "DELIVERY_TIME")

    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const setAndSaveMode = useCallback((mode: ControlKitchenMode) => {
        setMode(mode)
        LocalCache().set(StorageKey.CONTROL_KITCHEN_MODE, mode)
    }, [mode])

    function handleChangeCheckInFilter(e: SelectChangeEvent<CheckInFilter>) {
        const value = e.target.value
        if (isCheckInFilter(value)) {
            setCheckInFilter(value)
        }
    }

    const displayCheckedInStatus = (checkedIn: boolean | undefined) => {
        if (checkedIn) {
            return (
                <LocalizedStrict id="control-kitchen-checked-in-yes-chip" attrs={{ label: true }}>
                    <Chip label="Yes" color="success" variant="outlined" className={classes.checkedInStatus}></Chip>
                </LocalizedStrict>
            )
        } else {
            return (
                <LocalizedStrict id="control-kitchen-checked-in-no-chip" attrs={{ label: true }}>
                    <Chip label="No" color="error" variant="outlined" className={classes.checkedInStatus}></Chip>
                </LocalizedStrict>
            )
        }
    }

    function showReceipt(row: KitchenTableOrder) {
        setReceipt({
            orderId: row.id,
            orderUid: row.uid,
            orderType: row.orderType,
        })
    }

    const lastUpdatedTime = () => {
        const timeInMS = queryResult.dataUpdatedAt
        const lastUpdated = dateTimeFactory.fromMillis(timeInMS)
        return dateTimeFactory.formatTimeHms(lastUpdated)
    }

    const queryResult = useApiQuery(fetchKitchenPurchasesByPeriod, {
        queryName: "kitchen-purchases-by-period",
        dependencies: {
            merchantId: merchantId ?? 0,
            startTime: dateTimeFactory.toApiISOMinutesFormat(fromDateTime),
            endTime: dateTimeFactory.toApiISOMinutesFormat(toDateTime),
            mode: mode
        },
        enabled: merchantId !== undefined && fromDateTime !== null && toDateTime !== null && fromDateTime <= toDateTime,
    })

    const checkInId = "checked-in";
    const PurchaseTimeId = "purchase-time-id"

    const columns = useMemo<MRT_ColumnDef<KitchenTableOrder>[]>(
        () => {
            let res: MRT_ColumnDef<KitchenTableOrder>[] = [
                {
                    header: "Købstid",
                    accessorKey: 'created',
                    id: PurchaseTimeId,
                    Cell: ({ row }) => {
                        return <span>{dateTimeFactory.formatTime(dateTimeFactory.fromApi(row.original.created))}</span>
                    }
                },
                {
                    header: l10n.getString("control-kitchen-column-id"),
                    accessorKey: 'customer.employeeId',
                },
                {
                    header: l10n.getString("control-kitchen-column-name"),
                    accessorKey: 'customer.displayName',
                    Cell: ({ row }) => {
                        return <p className={classes.customerName}>{row.original?.customer?.displayName}</p >
                    },
                    minSize: 40, //allow columns to get smaller than default
                    maxSize: 500, //allow columns to get larger than default
                    size: 150, //make columns wider by default
                },
                {
                    header: l10n.getString("control-kitchen-checked-in"),
                    id: checkInId,
                    accessorFn: (originalRow) => (originalRow?.receipt?.checkIn.isValid ? 'yes' : 'no'), // must be a string
                    Cell: ({ row }) => {
                        const value = row.original?.receipt?.checkIn.isValid

                        return <>
                            <BooleanBadge isTrue={value} labelTrue={l10n.getString("control-kitchen-checked-in-yes-chip")} labelFalse={l10n.getString("control-kitchen-checked-in-no-chip")} />

                        </>
                    },
                    filterVariant: "select",
                    filterSelectOptions: [
                        {
                            value: "yes", text: l10n.getString("control-kitchen-checked-in-filter-checked-in")
                        },
                        {
                            value: "no", text: l10n.getString("control-kitchen-checked-in-filter-not-checked-in")

                        },
                    ],
                    muiTableHeadCellProps: {
                        align: "center"
                    },
                    muiTableBodyCellProps: {
                        align: "center"
                    },

                },
                {
                    header: l10n.getString("control-kitchen-column-order-details"),
                    accessorKey: 'orderLineNames',
                    Cell: ({ row }) => {
                        return (
                            <>
                                <Typography variant="caption" color="text.secondary" className={classes.totalItems}>
                                    {row.original?.orderSummary?.numberOfItems}
                                </Typography>
                                {row.original.orderLineNames}
                                <br />
                                {mode != "PURCHASE_TIME" && <Typography fontSize="0.6rem" variant='caption' color="text.secondary"> <FontAwesomeIcon icon={faClock} style={{ color: "#818283", paddingRight: "0.1rem", marginTop: "0.5rem" }} /> {dateTimeFactory.formatDateTime(dateTimeFactory.fromApi(row.original.created))} </Typography>}
                            </>
                        )
                    },
                    minSize: 40, //allow columns to get smaller than default
                    maxSize: 500, //allow columns to get larger than default
                    size: 150, //make columns wider by default
                },
                {
                    header: l10n.getString('office-purchase-amount'),
                    id: "amount",
                    accessorFn: (row) => moneyFactory.format(toDinero(row.amount)),
                    muiTableHeadCellProps: {
                        align: "right"
                    },
                    muiTableBodyCellProps: {
                        align: "right"
                    },
                },
            ]

            // if (mode === "PURCHASE_TIME") {
            //     return res.filter((el) => {
            //         return el.id !== checkInId
            //     })
            // }
            // if (mode === "DELIVERY_TIME") {
            //     return res.filter((el) => {
            //         return el.id !== PurchaseTimeId
            //     })
            // }

            return res
        },
        [l10n, classes, mode],
    )

    const tableData = useMemo(() => {
        try {
            if (queryResult.data) {
                const data = queryResult.data
                return data.orders.map((order) => ({
                    ...order,
                    startDate: data.reportDetails.startDate,
                    endDate: data.reportDetails.endDate,
                    orderLineNames: order.orderLines?.map(l => l.name).join(" \u2218 ") ?? ""
                }))
            }
            return []
        } catch (error: any) {
            setErrorMessage(error.displayMessage)
            setShowErrorToaster(true)
            return []
        }

    }, [queryResult.data])


    useEffect(() => {
        if (startDate !== null) {
            setFromDateTime((old) => startDate.set({ hour: old.hour, minute: old.minute, second: 0 }))
            setToDateTime((old) => startDate.set({ hour: old.hour, minute: old.minute, second: 0 }))
        }
    }, [startDate])



    useEffect(() => {
        if (fromDateTime > toDateTime) {
            setToDateTime(fromDateTime.plus({ minutes: 15 }))
        }
    }, [startDate, toDateTime, fromDateTime])

    useEffect(() => {
        const filter = columnFilters.find(filter => filter.id === checkInId)

        setCheckInFilter(_prev => {
            switch (filter?.value) {
                case "yes":
                    return CheckInFilter.CHECKED_IN
                case "no":
                    return CheckInFilter.NOT_CHECKED_IN
                case undefined:
                    return CheckInFilter.ALL
                default:
                    throw new Error(`Unknown check-in filter value: ${filter?.value}`)
            }
        })
    }, [columnFilters, setCheckInFilter])

    useEffect(() => {
        setColumnFilters(prev => {
            const filter = prev.find(filter => filter.id === checkInId)

            switch (checkInFilter) {
                case CheckInFilter.ALL:
                    if (filter) return prev.filter(f => f.id !== checkInId)
                    else return prev
                case CheckInFilter.CHECKED_IN:
                    if (!filter || filter.value !== "yes") {
                        return [
                            ...prev.filter(f => f.id !== checkInId),
                            { id: checkInId, value: "yes" }
                        ]
                    } else {
                        return prev
                    }
                case CheckInFilter.NOT_CHECKED_IN:
                    if (!filter || filter.value !== "no") {
                        return [
                            ...prev.filter(f => f.id !== checkInId),
                            { id: checkInId, value: "no" }
                        ]
                    } else {
                        return prev
                    }
                default:
                    throw new UnreachableCaseError(checkInFilter)
            }
        })
    }, [checkInFilter, setColumnFilters])

    return (
        <>
            <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                    severity="error" variant="filled">{errorMessage}
                </Alert>
            </Snackbar>

            <Grid marginTop="3rem" >

                <Box sx={{ display: 'flex', justifyContent: "space-between", marginBottom: "2rem" }}>
                    <PageHeader title={l10n.getString("control-kitchen-header")} page={Page.PURCHASE_CONTROL} icon={<FontAwesomeIcon icon={faFileChartColumn} style={{ color: "#2d9cf3", paddingRight: "1rem" }} />
                    }></PageHeader>
                    <Box bgcolor="#33c9dc" sx={{ marginTop: "2rem", padding: "0.7rem", borderRadius: 2, display: 'flex', flexDirection: "column", width: "12rem" }}>
                        <LocalizedStrict id='control-kitchen-checked-in-sub-title'>
                            <Typography variant='caption' color="white" fontSize="0.8rem" textAlign={"center"} >
                                Todays control code:
                            </Typography>
                        </LocalizedStrict>
                        <Typography variant='h6' alignSelf='end' color="white" sx={{ alignSelf: "center" }} >
                            {`${queryResult.data?.receipt.controlCode ?? ""}`}
                        </Typography>
                    </Box>
                </Box>
                <LocalizedMaterialReactTable
                    columns={columns}
                    onColumnFiltersChange={setColumnFilters}
                    data={tableData}
                    defaultColumn={{
                        minSize: 5, //allow columns to get smaller than default
                        maxSize: 5, //allow columns to get larger than default
                        size: 5, //make columns wider by default
                    }}
                    enableRowSelection
                    enableClickToCopy={false}
                    enableColumnOrdering
                    enableStickyHeader
                    enableStickyFooter
                    enableDensityToggle={false}
                    enableHiding
                    initialState={{ density: 'spacious' }}
                    enableRowActions
                    enableGrouping
                    muiTableContainerProps={{ sx: { maxHeight: "100%" } }}
                    positionActionsColumn="last"
                    enableColumnDragging={false}
                    renderRowActionMenuItems={({ row, closeMenu }) => [(
                        <MenuItem key="receipt" onClick={() => {
                            showReceipt(row.original)
                            closeMenu()
                        }}>
                            <LocalizedStrict id="control-kitchen-receipt">
                                <span>Receipt</span>
                            </LocalizedStrict>
                        </MenuItem>
                    )]}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderToolbarInternalActions={({ table }) => (
                        <>

                        </>
                    )}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Grid container wrap="nowrap" direction="column" marginX="1rem">
                            <Grid item paddingBottom={"2rem"} width="100%">
                                <SelectControlKitchenMode mode={mode} setAndSaveMode={setAndSaveMode} className="" />
                            </Grid>

                            <Grid container wrap="nowrap" justifyContent={"space-between"} alignItems="baseline" paddingBottom="1rem">
                                <Grid item container wrap="wrap" width="auto" gap="1rem">
                                    <DatePicker
                                        value={startDate}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                setStartDate(newValue)
                                            }
                                        }}
                                        label={l10n.getString(mode === "DELIVERY_TIME" ? "control-kitchen-date-delivery-label" : "control-kitchen-date-label")}
                                        slotProps={{ textField: { variant: "standard", size: "small" } }}
                                        className={classes.dateFilter}

                                    />

                                    <StandardTimePicker label={l10n.getString("control-kitchen-datetime-from-label")} dateTime={fromDateTime} setDateTime={setFromDateTime} />

                                    <StandardTimePicker label={l10n.getString("control-kitchen-datetime-to-label")} dateTime={toDateTime} setDateTime={setToDateTime} minTime={fromDateTime.plus({ minutes: 15 })} />


                                    {/* <TimePicker
                                        minTime={fromDateTime.plus({ minutes: 15 })}
                                        label={l10n.getString("control-kitchen-datetime-to-label")}
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }}
                                        minutesStep={5}
                                        value={toDateTime}
                                        onChange={(newValue) => {
                                            if (newValue !== null) {
                                                setToDateTime(newValue)
                                            }
                                        }}
                                        slotProps={{ textField: { variant: "standard", size: "small" }, openPickerButton: { className: classes.timePickerIconButton } }}
                                        className={classes.timeFilter}
                                    /> */}

                                    {/* HAMZA TODO: Make type commponent */}
                                    {mode === "DELIVERY_TIME" && <FormControl variant='standard' size='small' className={classes.checkInStatusFilter}>
                                        <LocalizedStrict id='control-kitchen-check-in-type'>
                                            <InputLabel>Type</InputLabel>
                                        </LocalizedStrict>
                                        <Select
                                            value={checkInFilter}
                                            onChange={handleChangeCheckInFilter}
                                        >
                                            {[...iterateStringEnum(CheckInFilter)].map((value) => (
                                                <MenuItem key={value} value={value}>
                                                    <LocalizedEnum base="control-kitchen-checked-in-filter" enumValue={value}>
                                                        <span>{value}</span>
                                                    </LocalizedEnum>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>}
                                </Grid>

                                <Grid item container wrap="nowrap" width="auto" justifyContent="flex-end" alignItems="center">
                                    <Box sx={{ marginRight: "0.5rem" }}>
                                        <LocalizedStrict id="control-kitchen-last-updated" vars={{ lastUpdated: lastUpdatedTime() }}>
                                            <Typography variant="caption" color="text.secondary">Last updated: {lastUpdatedTime()}</Typography>
                                        </LocalizedStrict>
                                        <Tooltip title={l10n.getString("control-kitchen-refresh")}>
                                            <IconButton onClick={() => queryResult.refetch()}>
                                                <FontAwesomeIcon size='xs' icon={faArrowRotateRight} />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <DropdownExportButtonControlKitchen rowsIsSelected={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} containsRows={table.getPrePaginationRowModel().rows.length === 0}
                                        allRowsWithFilter={table.getPrePaginationRowModel().rows}
                                        seletecRows={table.getSelectedRowModel().rows}
                                        chosenStartDate={fromDateTime.toString()}
                                        chosenEndDate={toDateTime.toString()}
                                    />
                                    <MRT_ToggleGlobalFilterButton table={table} sx={{ paddingRight: 0 }} />
                                    <MRT_FullScreenToggleButton table={table} sx={{ paddingRight: 0, marginRight: "-0.5rem" }} />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    state={{
                        isLoading: queryResult.isLoading,
                        showProgressBars: queryResult.isFetching,
                        columnFilters,
                        columnVisibility: { [PurchaseTimeId]: mode !== "DELIVERY_TIME", [checkInId]: mode !== "PURCHASE_TIME" }
                    }}
                />
            </Grid >
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

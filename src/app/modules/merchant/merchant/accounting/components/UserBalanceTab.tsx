import { Grid } from '@mui/material';
import { DateTime } from 'luxon';
import { MRT_ColumnDef, MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable';
import { useDateTime } from '../../../../localization/useDateTime';
import { useAppSelector } from '../../../../store/storeHooks';
import { SelectCustomer } from '../../production/components/SelectCustomer';
import { fetchCustomerBalanceReportByPeriod, UserBalance } from '../accountingApi';
import { ExportButtonCustomerBalance } from './ExportButtonCustomerBalance';

const useStyles = makeStyles()((theme) => ({
    dateFilter: {
        width: "11rem"
    }
}))


type UserBalanceTabProps = Readonly<{

}>

export function UserBalanceTab({ }: UserBalanceTabProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [endDate, setEndDate] = useState<DateTime>(DateTime.now())

    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const [customerId, setCustomerId] = useState<string>()
    const [customerGroupId, setCustomerGroupId] = useState<string>()

    const columns = useMemo<MRT_ColumnDef<UserBalance>[]>(
        () => [
            {
                header: l10n.getString("employee-id"),
                accessorKey: 'user.employeeId',
            },
            {
                header: l10n.getString("name"),
                accessorKey: 'user.displayName',
            },
            {
                header: l10n.getString("email"),
                accessorKey: 'user.email',
            },
            {
                header: l10n.getString('amount'),
                id: "totalAmount",
                accessorFn: (row) => moneyFactory.format(toDinero(row.totalAmount)),
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



    const customerBalanceReport = useApiQuery(fetchCustomerBalanceReportByPeriod, {
        queryName: "get-user-balance-by-period",

        dependencies: {
            merchantId: merchantId ?? 0,
            // startDate: startDate.toISODate(),
            // endDate: endDate.toISODate(),
            customerId: customerId,
            customerGroupId: customerGroupId

        },
        enabled: Boolean(merchantId),
    })

    const tableData = useMemo(() => {
        try {
            return customerBalanceReport.data?.usersBalance
        } catch (error: any) {
            // TODO test if you still need this since it's handled globally
            return []
        }

    }, [customerBalanceReport.data])










    return (
        <>
            <PageHeader title={l10n.getString("accounting-tab-customer-balance")} page={Page.ACCOUNTING_CUSTOMER_BALANCE}></PageHeader>


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
                    // renderRowActionMenuItems={({ row, closeMenu }) => [
                    //     (
                    //         <MenuItem onClick={() => {

                    //             closeMenu()
                    //         }}>
                    //             {l10n.getString("office-purchase-receipt")}
                    //         </MenuItem>
                    //     ),
                    // ]}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderToolbarInternalActions={({ table }) => (
                        <Grid paddingTop={"1rem"}>
                            <ExportButtonCustomerBalance startDate={startDate} endDate={endDate} data={customerBalanceReport.data} />
                            <MRT_ToggleGlobalFilterButton table={table} />
                            <MRT_FullScreenToggleButton table={table} />
                        </Grid>
                    )}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Grid container direction={'column'} width="80%">
                            <Grid container wrap='nowrap' justifyContent="start" alignItems="center" paddingY="1rem" marginLeft={"1rem"} gap={"2%"}>
                                {/* <DatePicker
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
                                /> */}

                                <SelectCustomer setCustomerId={setCustomerId} setCustomerGroupId={setCustomerGroupId} />


                                {/* <Grid >
                                    <FormControlLabel control={<Switch checked={isCancelled} onClick={() => setIsCancelled(!isCancelled)} />} label={l10n.getString("production-order-show-cancelled")} />
                                </Grid> */}

                            </Grid>
                        </Grid>
                    )}

                    state={{

                        isLoading: customerBalanceReport.isLoading,
                        showProgressBars: customerBalanceReport.isFetching,
                    }}
                />
            </Grid >




        </>
    )
}



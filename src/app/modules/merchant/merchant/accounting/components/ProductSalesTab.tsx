import { DKK } from '@dinero.js/currencies';
import { Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { add, Dinero } from 'dinero.js';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { LoadingSpinner } from '../../../../../shared/components/loading/LoadingSpinner';
import { StandardNoResultText } from '../../../../../shared/components/noResult/StandardNoResultText';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { useAppSelector } from '../../../../store/storeHooks';
import { SelectCustomer } from '../../production/components/SelectCustomer';
import { SelectShop } from '../../production/components/SelectShop';
import { fetchAllShops } from '../../production/productionApi';
import { fetchProducSalesByPeriod } from '../accountingApi';
import { ExportButtonProductSales } from './ExportButtonProductSales';

const useStyles = makeStyles()((_theme) => ({
    dateFilter: {
        width: "11rem",
        backgroundColor: "white"
    },
}))


type ProductSalesTabProps = Readonly<{

}>

export function ProductSalesTab({ }: ProductSalesTabProps) {

    const { classes, cx } = useStyles()
    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [endDate, setEndDate] = useState<DateTime>(DateTime.now())
    const [shopId, setShopId] = useState<string>()
    const [customerId, setCustomerId] = useState<string>()
    const [customerGroupId, setCustomerGroupId] = useState<string>()
    const { l10n } = useAppLocalization()


    const moneyFactory = useMoney({})



    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const productSalesReport = useApiQuery(fetchProducSalesByPeriod, {
        queryName: "get-all-product-sales",
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


    const allShops = useApiQuery(fetchAllShops, {
        queryName: "get-all-shops",
        dependencies: {
            startDate: startDate,
            endDate: endDate,
            merchantId: merchantId ?? 0,
            // Ask søren why it can be null
        },
        enabled: Boolean(merchantId),
    })


    const addMany = (addends: Dinero<number>[]) => addends.reduce(add);


    return (
        <>
            <PageHeader title={l10n.getString("accounting-tab-product-sales")} page={Page.ACCOUNTING_PRODUCT_SALES}></PageHeader>

            <Grid container wrap='nowrap' alignItems="center" width="100%" paddingTop="3rem" paddingBottom="2rem" >
                <Grid item container gap={"2rem"}>
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
                <Grid item alignItems={"end"}>
                    <ExportButtonProductSales data={productSalesReport.data} startDate={startDate.toISODate()} endDate={endDate.toISODate()} />
                </Grid>
            </Grid>

            {productSalesReport.isLoading && <LoadingSpinner />}
            {!productSalesReport.data?.productGroups && !productSalesReport.isFetching && <StandardNoResultText />}
            {productSalesReport.data?.productGroups && <TableContainer component={Paper} sx={{ marginBottom: "5rem" }}>
                <Table sx={{ minWidth: 500 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#F8F8F8", textAlign: "center", }}>
                            <LocalizedStrict id='accounting-product-sale-product-code'>
                                <TableCell sx={{ width: "auto" }}>
                                    Produktkode
                                </TableCell>
                            </LocalizedStrict>
                            <LocalizedStrict id='accounting-product-sale-product'>
                                <TableCell sx={{ width: "auto" }}> Produkter </TableCell>
                            </LocalizedStrict>
                            <LocalizedStrict id='accounting-product-sale-product-quantity'>
                                <TableCell sx={{ width: "auto", textAlign: "end" }}> Antal </TableCell>
                            </LocalizedStrict>

                            <LocalizedStrict id='accounting-product-sale-product-amount'>
                                <TableCell sx={{ width: "auto", textAlign: "end" }}> Beløb </TableCell>
                            </LocalizedStrict>
                        </TableRow>
                    </TableHead>


                    {productSalesReport.data?.productGroups.map((group, gIndex) => {

                        return (
                            <>
                                {!group.productSales && <Grid paddingBottom={"1rem"}>

                                    <LocalizedStrict id='production-list-no-result'>
                                        <Typography sx={{ fontSize: "14px", color: "#64748B", paddingBottom: "0.5rem" }}>No result</Typography>
                                    </LocalizedStrict>
                                </Grid>
                                }



                                {group.productSales && <>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#F8F8F8", textAlign: "center", }}>
                                            <TableCell sx={{ width: "175px", }}> </TableCell>
                                            <TableCell sx={{ width: "auto", fontWeight: "bold" }}> {group.name} </TableCell>
                                            <TableCell sx={{ width: "auto", textAlign: "end", fontWeight: "bold" }}> {group.productSales.reduce((acc, currentValue) => { return acc + currentValue.numberOfOrders }, 0)} </TableCell>
                                            <TableCell sx={{ width: "250px", textAlign: "end", fontWeight: "bold" }}> <> {moneyFactory.format(addMany(group.productSales.map((product) => { return toDinero(product.amount) })))} </> </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {group.productSales.map((product, pIndex) => {
                                            return (
                                                <>
                                                    <TableRow
                                                        key={product.name + pIndex}
                                                    >
                                                        <TableCell component="th" scope="row" sx={{ width: "auto", }}>
                                                            {product.code}
                                                        </TableCell>

                                                        <TableCell component="th" scope="row" sx={{ width: "auto", }}>
                                                            {product.name}
                                                        </TableCell>

                                                        <TableCell component="th" scope="row" sx={{ width: "auto", textAlign: "end" }}>
                                                            {product.numberOfOrders}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row" sx={{ width: "auto", textAlign: "end" }}>
                                                            {moneyFactory.format(toDinero(product.amount))}
                                                        </TableCell>

                                                    </TableRow>

                                                </>
                                            )
                                        })}
                                    </TableBody>
                                </>
                                }



                            </>
                        )

                    })}

                </Table>
            </TableContainer>}
        </>
    )
}



import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { highlightColor } from '../../../../../shared/colors/Colors'
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader'
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi'
import { useMoney } from '../../../../currency/useMoney'
import { MatchEnvironment } from '../../../../environment/components/MatchEnvironment'
import { EnvironmentType } from '../../../../environment/envTypes'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable'
import { useDateTime } from '../../../../localization/useDateTime'
import { useAppSelector } from '../../../../store/storeHooks'
import { ExportButtonProductionList } from '../components/ExportButtonProductionList'
import { SelectShop } from '../components/SelectShop'
import { SelectWeek } from '../components/SelectWeek'
import { fetchAllShops, fetchProductionListByPeriod, ProductionReport, Shop } from '../productionApi'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'
import { LoadingSpinner } from '../../../../../shared/components/loading/LoadingSpinner'
import { StandardNoResultText } from '../../../../../shared/components/noResult/StandardNoResultText'



const useStyles = makeStyles()((theme) => ({

}))

export type TableData = {
    productName: string;
    productId: number;
    datesObj: Record<DaysInWeek, DatesTableData>;
    total: number;
}

type DatesTableData = {
    displayDay: string;
    date: string;
    dayInWeek: number;
    sale: {
        items: number;
        amount: {
            amount: number;
            currency: string;
            scale: number;
            formatted?: string;
        };
    };
}









enum DaysInWeek {
    Mon = "Mon",
    Tue = "Tue",
    Wed = "Wed",
    Thu = "Thu",
    Fri = "Fri",
}

export function ProductionListTab() {

    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})


    const { classes, cx } = useStyles()

    const [startDate, setStartDate] = useState(DateTime.now().startOf("week").toISODate());
    const [endDate, setEndDate] = useState(DateTime.now().endOf("week").toISODate());

    const [shopId, setShopId] = useState<string | undefined>("")


    const merchantId = useAppSelector(selectEffectiveCompanyId)


    const productionList = useApiQuery(fetchProductionListByPeriod, {
        queryName: "get-all-production-list-by-period",
        dependencies: {
            startDate: startDate,
            endDate: endDate,
            merchantId: merchantId ?? 0,
            shopId: shopId
        },
        enabled: Boolean(merchantId),
    })


    const allShops = useApiQuery(fetchAllShops, {
        queryName: "get-all-shops",
        dependencies: {
            startDate: startDate,
            endDate: endDate,
            merchantId: merchantId ?? 0,
        },
        enabled: Boolean(merchantId),
    })

    const today = DateTime.now().toISODate()

    // TODO Ask søren where to place this function
    const highlightToday = (date: string) => {
        if (date === today) {
            return highlightColor
        }

        return ""
    }

    return (
        <>

            <PageHeader title={l10n.getString("production-list")} page={Page.PRODUCTION}></PageHeader>

            <>
                <Grid container paddingY="2rem" alignItems="center" justifyContent={"space-between"}>
                    <Grid item container width="auto" gap="2rem">
                        <SelectWeek setStartDate={setStartDate} startDate={startDate} setEndDate={setEndDate} />
                        <SelectShop shops={allShops.data?.shops ?? []} setShopId={setShopId} />
                    </Grid>
                    <Grid item >
                        <ExportButtonProductionList data={productionList.data} startDate={startDate} />
                    </Grid>
                </Grid>



                {productionList.isLoading && <LoadingSpinner />}
                {!productionList.data?.categories && !productionList.isFetching && <StandardNoResultText />}

                {productionList.data?.categories?.map((category) => {

                    return (

                        <>
                            <Grid paddingBottom={"1rem"}>

                                <Typography sx={{ fontSize: "25px", color: "#64748B", fontWeight: "bold", paddingBottom: "0.5rem" }}>{category.name}</Typography>

                                {!category.products && <LocalizedStrict id='production-list-no-result'>
                                    <Typography sx={{ fontSize: "14px", color: "#64748B", paddingBottom: "0.5rem" }}>No result</Typography>
                                </LocalizedStrict>}
                            </Grid>



                            {category.products && <TableContainer component={Paper} sx={{ marginBottom: "5rem" }}>
                                <Table sx={{ minWidth: 500 }}>

                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#F8F8F8", textAlign: "center", }}>

                                            <TableCell sx={{ width: "auto" }}> </TableCell>

                                            {category.products[0]?.dates?.map((day) => {
                                                return (<TableCell sx={{ textAlign: "center", backgroundColor: highlightToday(day.date) }}> {day.displayDay}</TableCell>)
                                            })}

                                        </TableRow>
                                    </TableHead>

                                    {category?.products?.map((product => {
                                        return (
                                            <>



                                                <TableBody>
                                                    <TableRow
                                                        key={product.id}
                                                    >
                                                        <TableCell component="th" scope="row" sx={{ width: "250px", }} >
                                                            {product.name}
                                                        </TableCell>

                                                        {product?.dates?.map((date) => {
                                                            return (
                                                                <TableCell sx={{ textAlign: "center", width: "100px", backgroundColor: highlightToday(date.date) }}>{date.sale.items}</TableCell>
                                                            )
                                                        })}
                                                    </TableRow>
                                                </TableBody>
                                            </>
                                        )
                                    }))}


                                </Table>
                            </TableContainer>}




                        </>
                    )
                })}
            </>

        </>
    )

}

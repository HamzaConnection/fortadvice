import { faChevronDown, faChevronRight } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { DateTime } from 'luxon'
import { useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader'
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi'
import { toDinero } from '../../../../currency/currencyLib'
import { useMoney } from '../../../../currency/useMoney'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { useDateTime } from '../../../../localization/useDateTime'
import { useAppSelector } from '../../../../store/storeHooks'
import { SelectCustomer } from '../../production/components/SelectCustomer'
import { SelectShop } from '../../production/components/SelectShop'
import { fetchAllShops } from '../../production/productionApi'
import { fetchBalanceByPeriod } from '../accountingApi'
import { ExportButtonBalance } from './ExportButtonBalance'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'
import { LoadingSpinner } from '../../../../../shared/components/loading/LoadingSpinner'
import { StandardNoResultText } from '../../../../../shared/components/noResult/StandardNoResultText'
import { StandardBreadcrumbs, BreadcrumbLink, Breadcrumb } from '../../../../../shared/components/links/StandardBreadcrumbs'

const useStyles = makeStyles()((_theme) => ({
    dateFilter: {
        width: "11rem",
        backgroundColor: "white"
    },
    alignChildren: {
        marginLeft: "2.5rem",
        width: "250px"
    }
}))


type BalanceTabProps = Readonly<{

}>

export function BalanceTab({ }: BalanceTabProps) {

    const { classes } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [endDate, setEndDate] = useState<DateTime>(DateTime.now())
    const [shopId, setShopId] = useState<string>()
    const [customerId, setCustomerId] = useState<string>()
    const [customerGroupId, setCustomerGroupId] = useState<string>()
    const [open, setOpen] = useState<string[]>([])

    const handleClick = (clickIndex: string) => {
        if (open.includes(clickIndex)) {
            const openCopy = open.filter((el) => { return el !== clickIndex })
            setOpen(openCopy)
        } else {
            const openCopy = [...open]
            openCopy.push(clickIndex)
            setOpen(openCopy)
        }
    }

    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const allShops = useApiQuery(fetchAllShops, {
        queryName: "get-all-shops",
        dependencies: {
            startDate: startDate,
            endDate: endDate,
            merchantId: merchantId ?? 0,
        },
        enabled: Boolean(merchantId),
    })


    const balance = useApiQuery(fetchBalanceByPeriod, {
        queryName: "get-balance-by-period",
        dependencies: {
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate(),
            merchantId: merchantId ?? 0,
            shopId: shopId,
            customerId: customerId,
            customerGroupId: customerGroupId,
        },
        enabled: Boolean(merchantId),
    })


    return (
        <>

            <PageHeader title={l10n.getString("accounting-tab-cash-register")} page={Page.ACCOUNTING_BALANCE}>



            </PageHeader>

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
                    <ExportButtonBalance startDate={dateTimeFactory.formatDate(startDate)} endDate={dateTimeFactory.formatDate(endDate)} data={balance.data} />
                </Grid>
            </Grid>



            {balance.isLoading && <LoadingSpinner />}
            {!balance.data?.categories && !balance.isFetching && <StandardNoResultText />}


            {
                balance.data?.categories?.map((category, cIndex) => {

                    return (

                        <>
                            <Grid paddingBottom={"1rem"}>

                                <Typography variant='body2' sx={{ fontSize: "25px", color: "#64748B", fontWeight: "bold", paddingBottom: "0.5rem" }}>{category.name}</Typography>

                                {!category.accounts && <LocalizedStrict id='production-list-no-result'>
                                    <Typography variant='body2' sx={{ color: "#64748B", paddingBottom: "0.5rem" }}>No result</Typography>
                                </LocalizedStrict>}
                            </Grid>



                            {category.accounts && <TableContainer component={Paper} sx={{ marginBottom: "5rem" }}>
                                <Table sx={{ minWidth: 500 }}>

                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#F8F8F8", textAlign: "center", }}>

                                            <TableCell sx={{ width: "auto" }}> </TableCell>
                                            {/* <LocalizedStrict id='accounting-product-sale-product-quantity'>
                                                <TableCell sx={{ width: "auto", textAlign: "end" }}> Antal</TableCell>
                                            </LocalizedStrict> */}
                                            <LocalizedStrict id='accounting-amount'>
                                                <TableCell sx={{ width: "auto", textAlign: "end" }}> Beløb </TableCell>
                                            </LocalizedStrict>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {category?.accounts?.map(((account, accIndex) => {
                                            return (
                                                <>

                                                    <TableRow
                                                        key={account.name + accIndex}
                                                        sx={{ cursor: account.paymentMethods && account?.paymentMethods?.length > 0 ? "pointer" : "" }}
                                                        onClick={() => handleClick(cIndex.toString() + account.name)}
                                                    >

                                                        <TableCell component="th" scope="row" sx={{ width: "250px", }} >

                                                            {account.paymentMethods && account?.paymentMethods?.length > 0 &&
                                                                <IconButton
                                                                    aria-label="expand row"
                                                                    size="small"
                                                                    style={{ marginRight: "1rem", }}
                                                                >
                                                                    {open.includes(cIndex.toString() + account.name) ? <FontAwesomeIcon icon={faChevronDown} /> : <FontAwesomeIcon icon={faChevronRight} />}
                                                                </IconButton>
                                                            }
                                                            <Typography variant='body2' sx={{ display: "inline", marginLeft: account.paymentMethods && account?.paymentMethods?.length > 0 ? "" : "2.4rem" }}>
                                                                {account.name}</Typography>
                                                        </TableCell>

                                                        {/* <TableCell component="th" scope="row" sx={{ width: "250px", textAlign: "end" }}>
                                                            {account.numberOfOrders}
                                                        </TableCell> */}

                                                        <TableCell component="th" scope="row" sx={{ width: "100px", textAlign: "end" }} >
                                                            {moneyFactory.format(toDinero(account.amount))}
                                                        </TableCell>
                                                    </TableRow>

                                                    {open.includes(cIndex.toString() + account.name) && account.paymentMethods && <TableRow sx={{ margin: "5rem" }}
                                                        key={account.name + accIndex + 1}
                                                    >
                                                        <TableCell colSpan={2} sx={{ padding: "0" }}>

                                                            <Collapse in={open.includes(cIndex.toString() + account.name)} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
                                                                {account.paymentMethods.map((paymentMethod, i) => {
                                                                    return (

                                                                        <Table>
                                                                            <TableRow
                                                                                key={account.name + i}
                                                                                sx={{}}
                                                                            >


                                                                                <TableCell component="th" scope="row"  >
                                                                                    <Typography variant='caption' color="text.secondary" sx={{ marginLeft: "2.2rem" }}> {paymentMethod.name}</Typography>
                                                                                </TableCell>


                                                                                <TableCell component="th" scope="row" sx={{ textAlign: "end" }} >
                                                                                    <Typography variant='caption' color="text.secondary" className={classes.alignChildren}>
                                                                                        {moneyFactory.format(toDinero(paymentMethod.amount))}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>

                                                                        </Table>
                                                                    )
                                                                })}
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                    }
                                                </>
                                            )
                                        }))}
                                    </TableBody>
                                </Table>
                            </TableContainer>}
                        </>
                    )
                })}
        </>
    )
}

import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Grid, IconButton, Skeleton, Switch, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { useDateTime } from '../../../../localization/useDateTime';
import { useAppSelector } from '../../../../store/storeHooks';
import { SelectCustomer } from '../../production/components/SelectCustomer';
import { SelectShop } from '../../production/components/SelectShop';
import { fetchAllShops } from '../../production/productionApi';
import { AccountingCustomer, fetchCustomerSalesByPeriod, getAccountingCustomers, getCustomerGroupSalesByAccounts, getCustomerSalesByAccounts } from '../accountingApi';
import { ExportButtonBalance } from './ExportButtonBalance';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { toDinero } from '../../../../currency/currencyLib';
import { LoadingSpinner } from '../../../../../shared/components/loading/LoadingSpinner';
import { AccountingDebitor } from '../accountingTypes';
import { ExpandableTableRow } from './ExpandableTableRow';
import { Box } from '@mui/system';
import { ExportButtonDebitors } from './ExportButtonDebitors';
import { StandardNoResultText } from '../../../../../shared/components/noResult/StandardNoResultText';
import { ChevronRight } from '@mui/icons-material';


const useStyles = makeStyles()((theme) => ({
    dateFilter: {
        width: "11rem",
        backgroundColor: "white"
    },

    accordionSummary: {
        flexDirection: "row-reverse", backgroundColor: "#E2E8F0",
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
        },
    },

    accordion: {
        '&:before': {
            display: 'none',
        },
        marginBottom: "2rem",

    }
}))


type CustomerAccountingTabProps = Readonly<{

}>

export function CustomerAccountingTab({ }: CustomerAccountingTabProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})
    const [startDate, setStartDate] = useState<DateTime>(DateTime.now())
    const [endDate, setEndDate] = useState<DateTime>(DateTime.now())
    const [shopId, setShopId] = useState<string>()
    const [customerId, setCustomerId] = useState<string>()
    const [customerGroupId, setCustomerGroupId] = useState<string>()
    const [expanded, setExpanded] = useState<string | false>(false);
    const [onlyWithSales, setOnlyWithSales] = useState<boolean>(false);


    const [expandedDebitor, setExpandedDebitor] = useState<AccountingDebitor>()

    const handleChange =
        (panel: string, debitor: AccountingDebitor) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false)
            setExpandedDebitor(isExpanded ? debitor : undefined)
        };


    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const allShops = useApiQuery(fetchAllShops, {
        queryName: "get-all-shops",
        dependencies: {
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate(),
            merchantId: merchantId ?? 0,
        },
        enabled: Boolean(merchantId),
    })

    const customerReport = useApiQuery(getAccountingCustomers, {
        queryName: "getAccountingCustomers",
        dependencies: {
            merchantId: merchantId ?? 0,
            customerId: customerId,
            customerGroupId: customerGroupId,
            hasSales: onlyWithSales ? true : undefined,
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate()
        },
        enabled: Boolean(merchantId),
    })

    const salesByAccounts = useApiQuery(getCustomerSalesByAccounts, {
        queryName: "customer-sales-by-account",
        dependencies: {
            merchantId: merchantId ?? 0,
            customerId: expandedDebitor?.id ?? 0,
            shopId: shopId,
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate(),
        },
        enabled: Boolean(merchantId) && expandedDebitor?.type === "customer",
    })


    const groupSalesByAccounts = useApiQuery(getCustomerGroupSalesByAccounts, {
        queryName: "customer-group-sales-by-account",
        dependencies: {
            merchantId: merchantId ?? 0,
            customerId: expandedDebitor?.type === "customerGroup" ? expandedDebitor.customerId : 0,
            customerGroupId: expandedDebitor?.id ?? 0,
            shopId: shopId,
            startDate: startDate.toISODate(),
            endDate: endDate.toISODate(),
        },
        enabled: Boolean(merchantId) && expandedDebitor?.type === "customerGroup",
    })

    const debitors: AccountingDebitor[] = useMemo(() => {
        if (!customerReport.data) return []

        return customerReport.data.customers.flatMap((customer) => {
            if (customer.isOfficeHotel && customer.userGroups) {

                const groupDebitors: AccountingDebitor[] = customer.userGroups.map((customerGroup) => ({
                    type: "customerGroup",
                    id: customerGroup.id,
                    customerId: customer.id,
                    name: customerGroup.name,
                    isActive: customerGroup.isActive,
                    hasSales: customerGroup.hasSales,
                }))

                return groupDebitors

            } else {

                const customerDebitor: AccountingDebitor = {
                    type: "customer",
                    id: customer.id,
                    name: customer.name,
                    isActive: customer.isActive,
                    hasSales: customer.hasSales ?? false,
                }

                return customerDebitor
            }
        })
    }, [customerReport.data])

    useEffect(() => {
        // TODO: Reset customer filter and expanded if the customer / customer group is no longer present in debitors
        console.log(expandedDebitor);
    }, [debitors, expandedDebitor])

    return (
        <>

            <PageHeader title={l10n.getString("accounting-tab-customer")} page={Page.ACCOUNTING_CUSTOMER}></PageHeader>


            <Grid container wrap='nowrap' alignItems="center" width="100%" paddingTop="3rem" paddingBottom="2rem" >
                <Grid item wrap='wrap' container gap={"2rem"}>
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


                    <FormControlLabel control={<Switch checked={onlyWithSales} onClick={() => setOnlyWithSales(!onlyWithSales)} />} label={l10n.getString("customer-accounting-show-customers-with-sales-only")} />

                </Grid>
                <Grid item alignItems={"end"}>
                    {merchantId && (
                        <ExportButtonDebitors
                            merchantId={merchantId}
                            startDate={startDate.toISODate()}
                            endDate={endDate.toISODate()}
                            debitors={debitors}
                        />
                    )}
                </Grid>
            </Grid>


            {!customerReport.data?.customers && !customerReport.isFetching && <Grid paddingBottom={"1rem"}>
                <StandardNoResultText />
            </Grid>
            }

            {customerReport.isLoading && <LoadingSpinner />}


            {debitors.map(((debitor, index) => {
                return (
                    <>
                        <Accordion disableGutters expanded={expanded === 'panel' + index} onChange={handleChange('panel' + index, debitor)} className={classes.accordion}>
                            <AccordionSummary
                                expandIcon={<ChevronRight />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                className={classes.accordionSummary}

                            >
                                <Typography variant='body2' >
                                    {debitor.name}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>

                                {debitor.type === "customer" &&
                                    <>
                                        {salesByAccounts.isLoading && <Box sx={{ width: "100%" }}>
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                        </Box>}
                                        {salesByAccounts.data?.salesByAccount.categories && salesByAccounts.data?.salesByAccount.categories.map((category) => {
                                            return (
                                                <>
                                                    <Typography variant='body2' gutterBottom marginBottom={"1rem"} marginTop={"2rem"} sx={{ fontWeight: "bold" }}>
                                                        {category.name}
                                                    </Typography>

                                                    <Table>
                                                        <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                                                            <TableRow>
                                                                <TableCell>

                                                                </TableCell>

                                                                <TableCell sx={{ textAlign: "end" }}>
                                                                    {category.accounts.some(acc => {
                                                                        return acc.products && acc.products.length > 0
                                                                    }) && l10n.getString("accounting-product-sale-product-quantity")}
                                                                </TableCell>

                                                                <TableCell sx={{ textAlign: "end", width: "250px" }}>
                                                                    {l10n.getString("accounting-amount")}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {category.accounts.map((customerAccount) => {
                                                                return (
                                                                    <>
                                                                        {customerAccount.products ?
                                                                            <ExpandableTableRow cellValue={customerAccount.name} cellValue2={moneyFactory.format(toDinero(customerAccount.amount))} hasChildren={Boolean(customerAccount.name && customerAccount.products)}>

                                                                                {customerAccount.products && customerAccount.products.map((product => {
                                                                                    return (
                                                                                        <TableRow>
                                                                                            <TableCell >
                                                                                                <Typography variant='body2' sx={{ marginLeft: "2.4rem" }}>{product.name}</Typography>
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: "end", color: "GrayText" }}>
                                                                                                {product.numberOfItems}
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: "end", color: "GrayText" }}>
                                                                                                {moneyFactory.format(toDinero(product.totalAmount))}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )
                                                                                }))}


                                                                            </ExpandableTableRow>
                                                                            :

                                                                            <TableRow>
                                                                                <TableCell >
                                                                                    <Typography variant='body2' sx={{ marginLeft: "2.4rem" }}>
                                                                                        {customerAccount.name}</Typography>
                                                                                </TableCell>
                                                                                <TableCell sx={{ textAlign: "end" }}>
                                                                                </TableCell>
                                                                                <TableCell sx={{ textAlign: "end" }}>
                                                                                    {moneyFactory.format(toDinero(customerAccount.amount))}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        }

                                                                    </>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </>

                                            )
                                        })}
                                    </>
                                }


                                {debitor.type === "customerGroup" &&
                                    <>


                                        {groupSalesByAccounts.isLoading && <Box sx={{ width: "100%" }}>
                                            <Skeleton />
                                            <Skeleton />
                                            <Skeleton />
                                        </Box>}
                                        {groupSalesByAccounts.data?.salesByAccount.categories && groupSalesByAccounts.data?.salesByAccount.categories.map((category) => {
                                            return (
                                                <>
                                                    <Typography variant='body2' gutterBottom marginBottom={"1rem"} marginTop={"2rem"} sx={{ fontWeight: "bold" }}>
                                                        {category.name}
                                                    </Typography>

                                                    <Typography variant='body2' color="GrayText" gutterBottom>
                                                        {category.amount.amount === 0 && "Intet salg i perioden"}
                                                    </Typography>



                                                    <Table>
                                                        <TableHead sx={{ backgroundColor: "#F8FAFC" }}>
                                                            <TableRow>
                                                                <TableCell>

                                                                </TableCell>
                                                                <TableCell sx={{ textAlign: "end" }}>
                                                                    {category.accounts.some(acc => {
                                                                        return acc.products && acc.products.length > 0
                                                                    }) && l10n.getString("accounting-product-sale-product-quantity")}
                                                                </TableCell>
                                                                <TableCell sx={{ textAlign: "end" }}>
                                                                    {l10n.getString("accounting-amount")}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {category.accounts.map((customerAccount) => {
                                                                return (
                                                                    <>
                                                                        {customerAccount.products ?
                                                                            <ExpandableTableRow cellValue={customerAccount.name} cellValue2={moneyFactory.format(toDinero(customerAccount.amount))} hasChildren={Boolean(customerAccount.name && customerAccount.products)}>

                                                                                {customerAccount.products && customerAccount.products.map((product => {
                                                                                    return (
                                                                                        <TableRow>
                                                                                            <TableCell >
                                                                                                <Typography variant='body2' sx={{ marginLeft: "2.4rem" }}>{product.name}</Typography>
                                                                                            </TableCell>
                                                                                            <TableCell sx={{ textAlign: "end" }}>
                                                                                                {product.numberOfItems}
                                                                                            </TableCell>

                                                                                            <TableCell sx={{ textAlign: "end" }}>
                                                                                                {moneyFactory.format(toDinero(product.totalAmount))}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    )
                                                                                }))}


                                                                            </ExpandableTableRow>
                                                                            :

                                                                            <TableRow>
                                                                                <TableCell >
                                                                                    <Typography variant='body2' sx={{ marginLeft: "2.4rem" }}>
                                                                                        {customerAccount.name}</Typography>
                                                                                </TableCell>
                                                                                <TableCell sx={{ textAlign: "end" }}>

                                                                                </TableCell>
                                                                                <TableCell sx={{ textAlign: "end" }}>
                                                                                    {moneyFactory.format(toDinero(customerAccount.amount))}

                                                                                </TableCell>
                                                                            </TableRow>
                                                                        }

                                                                    </>
                                                                )
                                                            })}
                                                        </TableBody>
                                                    </Table>
                                                </>

                                            )
                                        })}
                                    </>
                                }


                            </AccordionDetails>
                        </Accordion>
                    </>)
            }))}




        </>
    )
}



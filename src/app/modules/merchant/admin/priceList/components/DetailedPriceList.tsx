import { Chip, Divider, Grid, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { makeStyles } from 'tss-react/mui';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../../localization/useDateTime';
import { fetchDetailedPriceLists } from '../priceListApi';

const useStyles = makeStyles()((theme) => ({

}))


type DetailedPriceListProps = Readonly<{
    id: number;
}>

export function DetailedPriceList({ id }: DetailedPriceListProps) {


    const detailedPriceList = useApiQuery(fetchDetailedPriceLists, {
        queryName: "get-detailed-price-list",
        baseURL: mockServerUrl,
        dependencies: {
            id: id ?? 0,
        },
        enabled: Boolean(id),
    })



    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    if (detailedPriceList.data) {
        return (

            <>
                <Grid container direction={"column"} gap={"1rem"} marginX={"3rem"} marginY={"2rem"} width="auto">
                    <Typography fontWeight="bold" variant='body2'>{l10n.getString("price-list-currency")}:</Typography>
                    <Typography variant='body2'>{detailedPriceList.data.priceList.priceSetup.currencyCode}</Typography>
                    <Divider />

                    <Typography fontWeight="bold" variant='body2'>{l10n.getString("price-list-vat-code")}:</Typography>
                    <Typography variant='body2'>{detailedPriceList.data.priceList.priceSetup.vatCodeId}</Typography>
                    <Divider />

                    <Typography fontWeight="bold" variant='body2'>{l10n.getString("price-list-shops")}:</Typography>
                    <Stack direction="row" spacing={1}>
                        {detailedPriceList.data.priceList.shops.map((shop) => {
                            return (
                                <Chip label={shop.name} />
                            )
                        })}
                    </Stack>
                    <Divider />


                    <Typography fontWeight="bold" variant='body2'>{l10n.getString("price-list-company")}:</Typography>
                    <Stack direction="row" spacing={1}>
                        {detailedPriceList.data.priceList.customers.map((company) => {
                            return (
                                <Chip label={company.name} />
                            )
                        })}
                    </Stack>
                    <Divider />


                </Grid>


                {/* <Table sx={{ marginY: "2rem", background: "#f8fafc", }}>
                    <TableHead>
                        <TableRow>
                            <TableCell> {l10n.getString("price-list-vat-code")}</TableCell>
                            <TableCell>{l10n.getString("price-list-currency")}</TableCell>
                            <TableCell>{l10n.getString("price-list-shops")}</TableCell>
                            <TableCell>{l10n.getString("price-list-company")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{detailedPriceList.data.priceList.priceSetup.vatCodeId}</TableCell>
                            <TableCell>{detailedPriceList.data.priceList.priceSetup.currencyCode}</TableCell>
                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    {detailedPriceList.data.priceList.shops.map((shop) => {
                                        return (
                                            <Chip label={shop.name} />
                                        )
                                    })}
                                </Stack>
                            </TableCell>

                            <TableCell>
                                <Stack direction="row" spacing={1}>
                                    {detailedPriceList.data.priceList.customers.map((company) => {
                                        return (
                                            <Chip label={company.name} />
                                        )
                                    })}
                                </Stack>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table> */}
            </>


        )

    } else if (detailedPriceList.isError) {
        // show error
    }

    // show loading state
    return <Skeleton variant="rectangular" width={"100%"} height={300} />

}



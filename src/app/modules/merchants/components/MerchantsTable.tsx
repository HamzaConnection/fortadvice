import { Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { faChevronRight } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeStyles } from "tss-react/mui"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { Merchant } from "../../supplier/reporting/merchants/merchantTypes"

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
    merchantList: {
        marginTop: "2rem",
    },
    skeleton: {
        maxWidth: "15rem",
    },
}))

function TableCellSkeleton() {
    const { classes } = useStyles()

    return (
        <Skeleton variant="rectangular" animation="wave" className={classes.skeleton} />
    )
}

type Props = Readonly<{
    merchants?: Merchant[] | undefined
    onMerchantClick?: (merchant: Merchant) => void
}>

export function MerchantsTable({ merchants, onMerchantClick }: Props) {
    const { classes } = useStyles()

    return (
        <TableContainer component={Paper} className={classes.merchantList}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <LocalizedStrict id="supplier-merchant-access-table-header-case-no">
                                <span>Case No.</span>
                            </LocalizedStrict>
                        </TableCell>
                        <TableCell>
                            <LocalizedStrict id="supplier-merchant-access-table-header-name">
                                <span>Name</span>
                            </LocalizedStrict>
                        </TableCell>
                        <TableCell>
                            <LocalizedStrict id="supplier-merchant-access-table-header-address">
                                <span>Address</span>
                            </LocalizedStrict>
                        </TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!Boolean(merchants) && (
                        <TableRow>
                            <TableCell><TableCellSkeleton /></TableCell>
                            <TableCell><TableCellSkeleton /></TableCell>
                            <TableCell><TableCellSkeleton /></TableCell>
                        </TableRow>
                    )}
                    {merchants?.map((merchant) => (
                        <TableRow key={merchant.id} onClick={() => onMerchantClick?.(merchant)}>
                            <TableCell>{merchant.caseNumber}</TableCell>
                            <TableCell>{merchant.name}</TableCell>
                            <TableCell>{merchant.addressDisplayText}</TableCell>
                            <TableCell><FontAwesomeIcon icon={faChevronRight} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

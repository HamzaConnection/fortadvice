import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { MRT_Row } from 'material-react-table';
import { TableOrder } from '../purchasesApi';
import { useMoney } from '../../currency/useMoney';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { toCurrency, toDinero } from '../../currency/currencyLib';
import { getTranslationIdForEnum } from '../../localization/localizationLib';
import { StandardButton } from '../../../shared/components/buttons/StandardButton';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { StandardExportButton } from '../../../shared/components/table/StandardExportButton';


interface DropdownExportButtonProps {
    rowsIsSelected: boolean
    containsRows: boolean
    allRowsWithFilter: MRT_Row<TableOrder>[]
    seletecRows: MRT_Row<TableOrder>[]
    chosenStartDate: string
    chosenEndDate: string
}

export const DropdownExportButtonPurchases = ({ allRowsWithFilter, rowsIsSelected, seletecRows, containsRows, chosenStartDate, chosenEndDate }: DropdownExportButtonProps) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const csvOptions = mkConfig({
        fieldSeparator: ';',
        quoteStrings: true,
        decimalSeparator: '.',
        useBom: true,
        useKeysAsHeaders: true,
        filename: `GoPay-transactions-${chosenStartDate}_${chosenEndDate}`

    });




    // TODO: This depends on users installed Excel, should add popup to ask
    const moneyFactory = useMoney({ locale: "da-DK" })

    const { l10n } = useAppLocalization()


    const handleExportRows = (rows: MRT_Row<TableOrder>[]) => {

        const rowData = rows.map((row) => row.original)

        const exportRows = rowData.flatMap(order => {
            const exportRowsForOrder = order.orderLines.map((orderLine) => ({
                "From": order.startDate,
                "To": order.endDate,
                "Transaction id": order.id ?? "",
                "Card id": "",
                "Card number": "",
                "Product name": orderLine.name,
                "Items": orderLine.items,
                ["Price" + `(${moneyFactory.getLocalizedCurrencySymbol(toCurrency(orderLine.itemPrice.currency))})`]: moneyFactory.formatAsNumber(toDinero(orderLine.itemPrice)),
                ["Amount" + ` (${moneyFactory.getLocalizedCurrencySymbol(toCurrency(orderLine.price.currency))})`]: moneyFactory.formatAsNumber(toDinero(orderLine.price)),
                "Transaction Time": order.created,
                "User id": order?.customer?.id ?? "",
                "Employeed id": order?.customer?.employeedId ?? "",
                "Intials": order?.customer?.initials,
                "Surname": order?.customer?.surName,
                "GivenName": order?.customer?.givenName,
                "E-mail": order?.customer?.email,
                "Department": order?.customer?.department.name ?? "",
                "User group id": order?.customer?.userGroup.id ?? "",
                "User group": order?.customer?.userGroup.name,
                "Company VAT number": order.accountingCustomerParty.vatnumber,
                "Company": order.accountingCustomerParty.name,
                "Payment method": order.paymentDetails.method ? l10n.getStringForEnum("purchases-payment-method", order.paymentDetails.method, "") : "",
                "Debtor VAT number": "",
                "Debtor id": "",
                "Cost center": "",
                "Sales location": "",
                "Terminal id": "",
                "Channel": order.shopChannel
            }))

            return exportRowsForOrder
        })


        const csv = generateCsv(csvOptions)(exportRows);
        download(csvOptions)(csv)

    };

    return (
        <div>

            <StandardExportButton onClick={handleClick}
                endIcon={<ArrowDropDownIcon />} />
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <LocalizedStrict id='export-button-export-all-with-filter'>
                    <MenuItem disabled={containsRows} onClick={() => handleExportRows(allRowsWithFilter)}>Export all with filter</MenuItem>
                </LocalizedStrict>
                <LocalizedStrict id='export-button-export-selected-rows'>
                    <MenuItem disabled={rowsIsSelected} onClick={() => handleExportRows(seletecRows)}>Export Selected rows</MenuItem>
                </LocalizedStrict>
            </Menu>
        </div >
    );
}



import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { MRT_Row } from 'material-react-table';

import { useMoney } from '../../../currency/useMoney';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { toDinero } from '../../../currency/currencyLib';
import { KitchenTableOrder } from '../../controlKitchenApi';
import { StandardButton } from '../../../../shared/components/buttons/StandardButton';
import { LocalizedStrict } from '../../../localization/components/AppLocalized';
import { useAppLocalization } from '../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../localization/useDateTime';
import { StandardExportButton } from '../../../../shared/components/table/StandardExportButton';


interface DropdownExportButtonProps {
    rowsIsSelected: boolean
    containsRows: boolean
    allRowsWithFilter: MRT_Row<KitchenTableOrder>[]
    seletecRows: MRT_Row<KitchenTableOrder>[]
    chosenStartDate: string
    chosenEndDate: string
}



export function DropdownExportButtonControlKitchen({ allRowsWithFilter, rowsIsSelected, seletecRows, containsRows, chosenStartDate, chosenEndDate }: DropdownExportButtonProps) {



    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const dateTimeFactory = useDateTime()

    const formattedStartDate = dateTimeFactory.formatDate(dateTimeFactory.fromISO(chosenStartDate))
    const formattedEndDate = dateTimeFactory.formatDate(dateTimeFactory.fromISO(chosenEndDate))

    const csvOptions = mkConfig({
        fieldSeparator: ';',
        quoteStrings: true,
        decimalSeparator: '.',
        useBom: true,
        useKeysAsHeaders: true,
        filename: `Gopay-manager-control-${formattedStartDate}_${formattedEndDate}`
    });

    const moneyFactory = useMoney({})
    const { l10n } = useAppLocalization()


    const handleExportRows = (rows: MRT_Row<KitchenTableOrder>[]) => {
        const rowData = rows.map((row) => row.original)

        const exportRows = rowData.map((order) => ({

            "From": order.startDate,
            "To": order.endDate,
            "Is checked-in": order?.receipt?.checkIn?.isValid,
            "Checked-in time": order?.receipt?.checkIn?.checkInTime ?? "",
            "Transaction id": order.id,
            "Card id": "",
            "Card number": "",
            "Amount": moneyFactory.format(toDinero(order.amount)),
            "Order lines": order.orderLines?.map(l => l.name).join(" \u2218 ") ?? "",
            "Transaction Time": dateTimeFactory.formatDateTime(dateTimeFactory.fromApi(order.created)),
            "User id": order?.customer?.id ?? "",
            "Employeed id": order?.customer?.employeeId ?? "",
            "Intials": order?.customer?.initials,
            "Surname": order?.customer?.surName,
            "GivenName": order?.customer?.givenName,
            "E-mail": order?.customer?.email,
            "Department": order?.customer?.department?.name ?? "",
            "User group id": order?.customer?.userGroup?.id,
            "User group": order?.customer?.userGroup?.name ?? "",
            "Company VAT number": order.accountingCustomerParty?.vatNumber ?? "",
            "Company": order.accountingCustomerParty?.name ?? "",
            "Payment method": order.paymentDetails.method ? l10n.getStringForEnum("purchases-payment-method", order.paymentDetails.method, "") : "",
            "Sales location": "",
            "Terminal id": "",
        }))




        const csv = generateCsv(csvOptions)(exportRows);
        download(csvOptions)(csv)

    }




    return (
        <div>
            <StandardExportButton onClick={handleClick} endIcon={<ArrowDropDownIcon />} />
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
        </div>
    );
}



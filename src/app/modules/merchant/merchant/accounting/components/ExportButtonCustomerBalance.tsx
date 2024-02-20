import { download, generateCsv, mkConfig } from 'export-to-csv';
import { DateTime } from 'luxon';
import { makeStyles } from 'tss-react/mui';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { toCurrency, toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../../localization/useDateTime';
import { FetchCustomerBalanceReportResponse } from '../accountingApi';

const useStyles = makeStyles()((theme) => ({

}))


type ExportButtonCustomerBalanceProps = Readonly<{
    data: FetchCustomerBalanceReportResponse | null | undefined,
    startDate: DateTime,
    endDate: DateTime
}>

export function ExportButtonCustomerBalance({ data, startDate, endDate }: ExportButtonCustomerBalanceProps) {

    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    const { l10n } = useAppLocalization()

    const csvOptions = mkConfig({
        fieldSeparator: ';',
        quoteStrings: true,
        decimalSeparator: '.',
        useBom: true,
        useKeysAsHeaders: true,
        filename: `GoPay-Customer-Balance-${dateTimeFactory.formatDate(startDate)}_${dateTimeFactory.formatDate(endDate)}`
    });


    const handleExportRows = (data: FetchCustomerBalanceReportResponse | null | undefined,) => {


        const exportRows = data?.usersBalance?.map((userBalance) => {

            return {
                "From": dateTimeFactory.formatDate(startDate),
                "To": dateTimeFactory.formatDate(endDate),
                "Employeed id": userBalance.user.employeeId,
                "Name": userBalance.user.name,
                "Email": userBalance.user?.email,
                ["Amount" + `(${moneyFactory.getLocalizedCurrencySymbol(toCurrency(userBalance.totalAmount.currency))})`]: moneyFactory.formatAsNumber(toDinero(userBalance.totalAmount)),
            }







        })

        const csv = generateCsv(csvOptions)(exportRows ?? []);
        download(csvOptions)(csv)
    }


    return (
        <StandardExportButton onClick={() => handleExportRows(data)} />
    )
}



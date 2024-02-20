import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';

import { DateTime } from 'luxon';

import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { BalanceReport } from '../accountingApi';
import { toDinero } from '../../../../currency/currencyLib';



interface ExportButtonBalanceProps {
    data?: BalanceReport | undefined
    startDate: string
    endDate: string

}

export const ExportButtonBalance = ({ data, startDate, endDate }: ExportButtonBalanceProps) => {
    const { l10n } = useAppLocalization()
    const periodTranslation = l10n.getString("export-period")
    const moneyFactory = useMoney({})


    const handleExportRows = (data: BalanceReport | undefined) => {

        const csvOptions = mkConfig({
            fieldSeparator: ';',
            quoteStrings: true,
            decimalSeparator: '.',
            useBom: true,
            useKeysAsHeaders: true,
            showColumnHeaders: false,
            filename: `GoPay-Balance-${startDate}_${endDate}`
        });

        if (data?.categories) {
            const exportRowsForBalance = data.categories.flatMap((category) => ([
                {
                    "column1": category.name,
                    "column2": `Beløb (${(category.amount.currency)})`,
                },
                ...category.accounts.map((account) => ({
                    "column1": account.name,
                    "column2": moneyFactory.formatAsNumber(toDinero(account.amount)),
                })),
                {
                    "column1": "Total",
                    "column2": moneyFactory.formatAsNumber(toDinero(category.amount)),
                },
                {
                    "column1": "",
                    "column2": "",
                },
            ]))

            exportRowsForBalance.unshift(({
                "column1": "",
                "column2": "",
            }))

            exportRowsForBalance.unshift(({
                "column1": `${periodTranslation} ${startDate} - ${endDate}`,
                "column2": ""
            }))

            const csv = generateCsv(csvOptions)(exportRowsForBalance);
            download(csvOptions)(csv)
        }






    };

    return (

        <StandardExportButton onClick={() => handleExportRows(data)} />
    );
}




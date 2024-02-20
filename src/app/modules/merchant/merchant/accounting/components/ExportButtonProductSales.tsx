import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';

import { DateTime } from 'luxon';

import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { BalanceReport, FetchProducSalesResponse } from '../accountingApi';
import { toDinero } from '../../../../currency/currencyLib';



interface ExportButtonProductSalesProps {
    data?: FetchProducSalesResponse | undefined
    startDate: string
    endDate: string
}

export const ExportButtonProductSales = ({ data, startDate, endDate }: ExportButtonProductSalesProps) => {
    const { l10n } = useAppLocalization()
    const periodTranslation = l10n.getString("export-period")
    const moneyFactory = useMoney({})


    const handleExportRows = (data: FetchProducSalesResponse | undefined) => {

        const csvOptions = mkConfig({
            fieldSeparator: ';',
            quoteStrings: true,
            decimalSeparator: '.',
            useBom: true,
            useKeysAsHeaders: true,
            showColumnHeaders: false,
            filename: `GoPay-ProductSales-${startDate}_${endDate}`
        });

        if (data?.productGroups) {
            const exportRowsForBalance = data.productGroups.flatMap((productGroup) => ([
                {
                    "column1": productGroup.name,
                    "column2": `Beløb (${(productGroup.totalAmount.currency)})`,
                },
                ...productGroup.productSales.map((product) => ({
                    "column1": product.name,
                    "column2": moneyFactory.formatAsNumber(toDinero(product.amount)),
                })),
                {
                    "column1": "Total",
                    "column2": moneyFactory.formatAsNumber(toDinero(productGroup.totalAmount)),
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




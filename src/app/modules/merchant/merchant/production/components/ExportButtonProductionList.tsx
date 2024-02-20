import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { TableData } from '../pages/ProductionListTab';
import { DateTime } from 'luxon';
import { ProductionReport } from '../productionApi';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';



interface DropdownExportButtonProps {
    data: ProductionReport | undefined
    startDate: string

}

export const ExportButtonProductionList = ({ data, startDate }: DropdownExportButtonProps) => {

    const luxonDate = DateTime.fromISO(startDate)
    const csvOptions = mkConfig({
        fieldSeparator: ';',
        quoteStrings: true,
        decimalSeparator: '.',
        useBom: true,
        useKeysAsHeaders: true,
        filename: `GoPay-Production-${luxonDate.toISODate()}_${luxonDate.plus({ days: 4 }).toISODate()}`
    });




    const { l10n } = useAppLocalization()

    const handleExportRows = (data: ProductionReport | undefined) => {

        if (data?.categories) {

            const exportRowsForOrder = data.categories.flatMap((category) => {

                if (category.products) {

                    const data = category.products.flatMap((product) => {

                        if (product.dates) {


                            const dates = product.dates.map((day) => {
                                return { [day.displayDay]: day.sale.items, }
                            })

                            const allDates = Object.assign({}, ...dates)


                            return {
                                "Product Name": `${product.name}`,
                                ...allDates
                            }
                        }
                        return []

                    })

                    if (data) {
                        return data
                    }
                }
                return []
            })

            const csv = generateCsv(csvOptions)([...exportRowsForOrder]);
            download(csvOptions)(csv)

        }
    };

    return (
        <StandardExportButton onClick={() => handleExportRows(data)} />
    );
}



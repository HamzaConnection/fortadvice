import { download, generateCsv, mkConfig } from 'export-to-csv';
import { DateTime } from 'luxon';
import { makeStyles } from 'tss-react/mui';
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../../localization/useDateTime';
import { StandardTransactionResultResponse } from '../productionApi';

const useStyles = makeStyles()((theme) => ({

}))


type ExportButtonResultModalProps = Readonly<{
    data: StandardTransactionResultResponse | undefined,
}>


export function ExportButtonResultModal({ data }: ExportButtonResultModalProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})


    const csvOptions = mkConfig({
        fieldSeparator: ';',
        quoteStrings: true,
        decimalSeparator: '.',
        useBom: true,
        useKeysAsHeaders: true,
        filename: `GoPay-result-${dateTimeFactory.formatDate(DateTime.now())}`
    });


    const handleExportRows = (data: StandardTransactionResultResponse | undefined) => {

        if (data?.transactionResults) {

            const exportRowsForOrder = data.transactionResults.map((result) => {

                return {
                    "Order no.": `${result.order.id}`,
                    "Delivery date": `${dateTimeFactory.formatDateTime(dateTimeFactory.fromApi(result.order.deliveryDetails.time))}`,
                    "Message": `${result.status.text}`,

                }
            })

            const csv = generateCsv(csvOptions)([...exportRowsForOrder]);
            download(csvOptions)(csv)

        }
    };


    return (
        <StandardExportButton onClick={() => handleExportRows(data)} />
    )
}



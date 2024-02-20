import { download, generateCsv, mkConfig } from 'export-to-csv';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { toCurrency, toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../../localization/useDateTime'
import { Order } from '../../../controlKitchenTypes'
import { MonetaryAmount } from '../../../../currency/currencyTypes';

type useExportOrdersToCsvParams = Readonly<{
    data: Order[] | null | undefined,
    startDate: DateTime,
    endDate: DateTime
}>

export function useExportOrdersToCsv({ data, startDate, endDate }: useExportOrdersToCsvParams) {
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({ locale: "da-DK" })

    const { l10n } = useAppLocalization()

    function getCurrencyString(amount: MonetaryAmount | undefined) {
        if (!amount) return ""
        const currency = toCurrency(amount.currency)
        return moneyFactory.getLocalizedCurrencySymbol(currency)
    }

    function getAmountString(amount: MonetaryAmount | undefined) {
        if (!amount) return ""
        const dinero = toDinero(amount)
        return moneyFactory.formatAsNumber(dinero)
    }

    const doExport = useCallback(() => {


        const csvOptions = mkConfig({
            fieldSeparator: ';',
            quoteStrings: true,
            decimalSeparator: '.',
            useBom: true,
            useKeysAsHeaders: true,
            filename: `GoPay-Orders-${dateTimeFactory.formatDate(startDate)}_${dateTimeFactory.formatDate(endDate)}`
        });





        const exportRows = data?.flatMap((order) => {

            if (order.orderLines) {

                const exportRowsForOrder = order.orderLines?.map((orderline) => ({

                    "From": dateTimeFactory.formatDate(startDate),
                    "To": dateTimeFactory.formatDate(endDate),
                    "Order Id": order.id,
                    "Transaction time": order.created,
                    "Order status": order.orderStatus ?? "",
                    "Product id": orderline.productId,
                    "Product name": orderline.name,
                    "Items": orderline.items,
                    ["Item price " + `(${getCurrencyString(orderline.itemPrice)})`]: getAmountString(orderline.itemPrice),
                    ["Amount " + `(${getCurrencyString(orderline.price)})`]: getAmountString(orderline.price),
                    "User id": order.customer?.id,
                    "Employeed id": order.customer?.employeeId,
                    "Intials": order.customer?.initials,
                    "Name": order.customer?.displayName,
                    "Email": order.customer?.email,
                    "User group id": order.customer?.userGroup?.id ?? "",
                    "User group": order.customer?.userGroup?.name ?? "",
                    "Company": order.accountingCustomerParty?.name,
                    "Payment method": l10n.getStringForEnum("purchases-payment-method", order.paymentDetails.method ?? "", ""),
                    "Sales location": ""

                }))
                return exportRowsForOrder
            }
            return []

        })

        const csv = generateCsv(csvOptions)(exportRows ?? []);
        download(csvOptions)(csv)

    }, [dateTimeFactory, moneyFactory, data, startDate, endDate])

    return doExport
}


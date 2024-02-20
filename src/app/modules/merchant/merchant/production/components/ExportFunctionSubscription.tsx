import { download, generateCsv, mkConfig } from 'export-to-csv';
import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { toCurrency, toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../../localization/useDateTime'
import { Subscription } from '../../accounting/accountingApi';

type useExportOrdersToCsvParams = Readonly<{
    data: Subscription[] | null | undefined,
    startDate: DateTime,
    endDate: DateTime
}>

export function useExportSubscriptionToCsv({ data, startDate, endDate }: useExportOrdersToCsvParams) {
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({ locale: "da-DK" })

    const { l10n } = useAppLocalization()


    const doExport = useCallback(() => {


        const csvOptions = mkConfig({
            fieldSeparator: ';',
            quoteStrings: true,
            decimalSeparator: '.',
            useBom: true,
            useKeysAsHeaders: true,
            filename: `GoPay-Subscription-${dateTimeFactory.formatDate(startDate)}_${dateTimeFactory.formatDate(endDate)}`
        });

        const exportRows = data?.flatMap((subscription) => ({

            "From": dateTimeFactory.formatDate(startDate),
            "To": dateTimeFactory.formatDate(endDate),
            "User Id": subscription.subscriptionDetails.customer.employeeId,
            "Intials": subscription.subscriptionDetails.customer?.initials,
            "Given Name": subscription.subscriptionDetails.customer.givenName,
            "Surname": subscription.subscriptionDetails?.customer.surName,
            "Email": subscription.subscriptionDetails.customer.email,
            "Subscription name": subscription.name,
            ["Price" + `(${subscription.subscriptionDetails.amount ? moneyFactory.getLocalizedCurrencySymbol(toCurrency(subscription.subscriptionDetails.amount.currency)) : ""})`]: subscription.subscriptionDetails.amount ? moneyFactory.formatAsNumber(toDinero(subscription.subscriptionDetails.amount)) : "",
            "Valid from": subscription.subscriptionDetails.validFrom,
            "Valid to": subscription.subscriptionDetails.validTo ?? "",
            "Created": subscription.subscriptionDetails.order.created,
            "Customer group": subscription.subscriptionDetails.customer.userGroup.name,
            "Company": subscription.subscriptionDetails.order.accountingCustomerParty.name,
            "Subscription id": subscription.id,
            "Order id": subscription.subscriptionDetails.order.id,
            "Payment id": subscription.subscriptionDetails.paymentDetails.subscriptionId,
        }))

        const csv = generateCsv(csvOptions)(exportRows ?? []);
        download(csvOptions)(csv)

    }, [dateTimeFactory, moneyFactory, data, startDate, endDate])

    return doExport
}


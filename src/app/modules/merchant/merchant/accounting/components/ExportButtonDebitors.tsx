import { useState } from 'react'
import { useSnackbar } from 'notistack'
import { download, generateCsv, mkConfig } from 'export-to-csv'
import { sleep } from '../../../../../lib/lang'
import { Logger } from '../../../../../lib/logging'
import { toArrayAsync } from '../../../../../lib/iterables'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { toDinero } from '../../../../currency/currencyLib'
import { useMoney } from '../../../../currency/useMoney'
import { useApiMutation } from '../../../../../core/api/useApiMutation'
import { StandardExportButton } from '../../../../../shared/components/table/StandardExportButton'
import { AccountingDebitor, DebitorWithSalesByAccount } from '../accountingTypes'
import { getCustomerGroupSalesByAccounts, getCustomerSalesByAccounts } from '../accountingApi'


type Props = Readonly<{
    merchantId: number
    startDate: string
    endDate: string
    debitors: AccountingDebitor[] | undefined
}>

export function ExportButtonDebitors({ merchantId, startDate, endDate, debitors }: Props) {
    const [loading, setLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar()

    const { l10n } = useAppLocalization()
    const moneyFactory = useMoney({})

    const { mutateAsync: callGetCustomerSales } = useApiMutation(getCustomerSalesByAccounts, {})
    const { mutateAsync: callGetCustomerGroupSales } = useApiMutation(getCustomerGroupSalesByAccounts, {})

    const periodTranslation = l10n.getString("export-period")

    async function* generateReportData() {
        if (!debitors) return

        for (const debtor of debitors) {
            if (debtor.type === "customer") {
                const sales = await callGetCustomerSales({
                    merchantId,
                    customerId: debtor.id,
                    startDate,
                    endDate
                })

                const result: DebitorWithSalesByAccount = {
                    sales: sales.salesByAccount,
                    ...debtor
                }

                yield result
            } else {
                const sales = await callGetCustomerGroupSales({
                    merchantId,
                    customerId: debtor.customerId,
                    customerGroupId: debtor.id,
                    startDate,
                    endDate,
                })

                const result: DebitorWithSalesByAccount = {
                    sales: sales.salesByAccount,
                    ...debtor
                }

                yield result
            }

            // Throttle the requests to avoid API-side throttling
            await sleep(250)
        }
    }

    function handleExportRows(data: DebitorWithSalesByAccount[]) {
        const csvOptions = mkConfig({
            fieldSeparator: ';',
            quoteStrings: true,
            decimalSeparator: '.',
            useBom: true,
            useKeysAsHeaders: true,
            showColumnHeaders: false,
            filename: `GoPay-Debtors-${startDate}_${endDate}`
        })

        const exportRowsForBalance = data.flatMap((debtor) => ([
            {
                "column1": debtor.name,
                "column2": "",
                "column3": "",
                "column4": "",
            },
            ...debtor.sales.categories.flatMap((category) => ([
                {
                    "column1": category.name,
                    "column2": "",
                    "column3": l10n.getString("accounting-debtors-export-items-label"),
                    "column4": l10n.getString("accounting-debtors-export-amount-label", { currencyCode: category.amount.currency }),
                },
                {
                    "column1": "",
                    "column2": "",
                    "column3": "",
                    "column4": "",
                },
                ...category.accounts.flatMap((account) => ([
                    {
                        "column1": account.name,
                        "column2": "",
                        "column3": "",
                        "column4": "",
                    },
                    ...(account.products ?? []).map((product) => ({
                        "column1": product.name,
                        "column2": product.code,
                        "column3": product.numberOfItems,
                        "column4": moneyFactory.formatAsNumber(toDinero(product.totalAmount)),
                    })),
                    {
                        "column1": l10n.getString("accounting-debtors-export-total-label", { name: account.name }),
                        "column2": "",
                        "column3": "",
                        "column4": moneyFactory.formatAsNumber(toDinero(account.amount)),
                    }
                ])),
                {
                    "column1": "",
                    "column2": "",
                    "column3": "",
                    "column4": "",
                },
                {
                    "column1": l10n.getString("accounting-debtors-export-subtotal-label", { name: category.name }),
                    "column2": "",
                    "column3": "",
                    "column4": moneyFactory.formatAsNumber(toDinero(category.amount)),
                },
                {
                    "column1": "",
                    "column2": "",
                    "column3": "",
                    "column4": "",
                },
            ])),
            {
                "column1": "",
                "column2": "",
                "column3": "",
                "column4": "",
            }
        ]))

        exportRowsForBalance.unshift(({
            "column1": "",
            "column2": "",
            "column3": "",
            "column4": "",
        }))

        exportRowsForBalance.unshift(({
            "column1": `${periodTranslation}: ${startDate} - ${endDate}`,
            "column2": "",
            "column3": "",
            "column4": "",
        }))

        const csv = generateCsv(csvOptions)(exportRowsForBalance)
        download(csvOptions)(csv)
    }

    function handleClick() {
        const logger = new Logger("debitors")
        setLoading(true)

        toArrayAsync(generateReportData())
            .then((data) => handleExportRows(data))
            .catch((error) => {
                logger.error("Failed to export debitors", error)

                enqueueSnackbar({
                    variant: "error",
                    message: l10n.getString("accounting-debtors-export-failed")
                })}
            )
            .finally(() => setLoading(false))
    }

    return (
        <StandardExportButton loading={loading} onClick={handleClick} />
    )
}

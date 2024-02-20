import { Currency, Dinero } from "dinero.js"
import { useMemo } from "react"
import { createRoundingMoneyFormatter, createRoundingNumberFormatter } from "./currencyLib"
import { useAppSelector } from "../store/storeHooks"
import { selectSelectedLocale } from "../localization/localizationSelectors"

type MoneyFactoryOptions = Readonly<{
    locale: string
}>




export class MoneyFactory {
    public readonly locale: string
    private formatter: (amount: Dinero<number>) => string
    private numberFormatter: (amount: Dinero<number>) => string

    constructor({ locale }: MoneyFactoryOptions) {
        this.locale = locale
        this.formatter = createRoundingMoneyFormatter(locale)
        this.numberFormatter = createRoundingNumberFormatter(locale)
    }

    isCurrencyPrefixed(currency: Currency<number>) {
        const formatter = Intl.NumberFormat(this.locale, { style: "currency", currency: currency.code })
        const probe = formatter.format(10)
        return probe.slice(0, 2) !== "10"
    }

    getLocalizedCurrencySymbol(currency: Currency<number>) {
        const formatter = Intl.NumberFormat(this.locale, { style: "currency", currency: currency.code })
        const parts = formatter.formatToParts(10)
        return parts.find(p => p.type === "currency")?.value ?? currency.code
    }

    // Gets the amount for instance 100 dk based on language
    format(amount: Dinero<number>): string {
        return this.formatter(amount)
    }

    // removes currency and gets the amount only
    formatAsNumber(amount: Dinero<number>) {
        return this.numberFormatter(amount)
    }

    formatAsNumberWithScale(amount: Dinero<number>, scale: "currency" | "value") {
        if (scale === "currency") {
            return this.formatAsNumber(amount)
        } else {
            const formatter = createRoundingNumberFormatter(this.locale, scale)
            return formatter(amount)
        }
    }
}

type UseMoneyOptions = Readonly<{
    locale?: string
}>

export function useMoney({ locale }: UseMoneyOptions) {
    const selectedLocale = useAppSelector(selectSelectedLocale)
    const localeToUse = locale ?? selectedLocale
    const factory = useMemo(() => new MoneyFactory({ locale: localeToUse }), [locale])

    return factory
}

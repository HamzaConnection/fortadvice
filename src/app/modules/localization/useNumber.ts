import { useMemo } from "react"
import { useAppSelector } from "../store/storeHooks"
import { selectSelectedLocale } from "./localizationSelectors"

type NumberFactoryOptions = Readonly<{
    locale: string
}>

export class NumberFactory {
    public readonly locale: string
    public readonly decimalSeparator: string
    public readonly groupSeparator: string
    private formatter: Intl.NumberFormat

    constructor({ locale }: NumberFactoryOptions) {
        this.locale = locale
        this.formatter = Intl.NumberFormat(locale)

        this.decimalSeparator = this.formatter.formatToParts(1.1)
            .find(part => part.type === "decimal")
            ?.value ?? "."

        this.groupSeparator = this.formatter.formatToParts(1000000)
            .find(part => part.type === "group")
            ?.value ?? ","
    }

    format(value: number): string {
        return this.formatter.format(value)
    }

    formatToDecimal(value: number, fractionDigits: number): string {
        const formatter = Intl.NumberFormat(this.locale, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        })

        return formatter.format(value)
    }
}

type UseNumberOptions = Readonly<{
    locale?: string
}>

export function useNumber({ locale }: UseNumberOptions) {
    const selectedLocale = useAppSelector(selectSelectedLocale)
    const localeToUse = locale ?? selectedLocale
    const factory = useMemo(() => new NumberFactory({ locale: localeToUse }), [localeToUse])

    return factory
}

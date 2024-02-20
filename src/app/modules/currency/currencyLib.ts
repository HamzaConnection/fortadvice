import { Dinero, dinero, toDecimal, toSnapshot, transformScale } from "dinero.js"
import { TransformerOptions } from "@dinero.js/core"
import { DKK, NOK, SEK, EUR, GBP, USD, Currency } from "@dinero.js/currencies"
import { MonetaryAmount } from "./currencyTypes"

const SUPPORTED_CURRENCIES = [DKK, NOK, SEK, EUR, GBP, USD]

const currencyMap = SUPPORTED_CURRENCIES.reduce(
    (map, cur) => map.set(cur.code, cur),
    new Map() as Map<string, Currency<number>>)

export function toCurrency(currencyCode: string) {
    const currency = currencyMap.get(currencyCode)

    if (currency) {
        return currency
    } else {
        throw new Error(`Unsupported currency code: ${currencyCode}`)
    }
}

export function zeroDinero(currency: Currency<number>) {
    return dinero({ amount: 0, scale: currency.exponent, currency })
}

export function toDinero(monetaryAmount: MonetaryAmount) {
    const { amount, scale, currency: code } = monetaryAmount
    const currency = toCurrency(code)
    return dinero({ amount, scale, currency })
}

export function toDineroOrUndefined(monetaryAmount: MonetaryAmount | undefined) {
    return (monetaryAmount) ? toDinero(monetaryAmount) : undefined
}

export function toDineroLossy(value: number, currency: Currency<number>) {
    if (typeof currency.base === "number") {
        const factor = currency.base ** currency.exponent
        const amount = Math.round(value * factor)

        return dinero({ amount: amount, currency })

    } else {
        throw new Error(`Unsupported currency (multiple subdivisions not supported): ${currency.code}`)
    }
}

export function toMonetaryAmount(dinero: Dinero<number>) {
    const { amount, scale, currency: { code: currencyCode } } = toSnapshot(dinero)

    const monetaryAmount: MonetaryAmount = {
        amount,
        scale,
        currency: currencyCode
    }

    return monetaryAmount
}

export function toNumberLossy(value: Dinero<number>) {
    const { amount, scale } = toSnapshot(value)
    return amount / Math.pow(10, scale)
}

export function roundToCurrency(value: Dinero<number>) {
    const { currency: { exponent: currencyScale } } = toSnapshot(value)
    return transformScale(value, currencyScale)
}

export function createMoneyFormatter(locale: string) {
    function transformer({ value, currency }: TransformerOptions<number, string>) {
        return Number(value).toLocaleString(locale, {
            style: "currency",
            currency: currency.code,
        })
    }

    return function formatter(value: Dinero<number>) {
        return toDecimal(value, transformer)
    }
}

export function createRoundingMoneyFormatter(locale: string) {
    const formatter = createMoneyFormatter(locale)

    return function roundingFormatter(value: Dinero<number>) {
        const rounded = roundToCurrency(value)
        return formatter(rounded)
    }
}

function isCurrencyPart(partType: string) {
    return partType === "code" ||
        partType === "currency" ||
        partType === "literal" ||
        partType === "symbol"
}

export function createRoundingNumberFormatter(locale: string, scale: "currency" | "value" = "currency") {
    function transformer({ value, currency }: TransformerOptions<number, string>) {
        const numberFormat = Intl.NumberFormat(locale, {
            style: "currency",
            currency: currency.code,
        })
        const result = numberFormat.formatToParts(Number(value))
            .filter(part => !isCurrencyPart(part.type))
            .map(part => part.value)
            .join("")
        return result
    }

    if (scale === "currency") {
        return function currencyRoundingFormatter(value: Dinero<number>) {
            const rounded = roundToCurrency(value)
            return toDecimal(rounded, transformer)
        }

    } else {

        return function valueRoundingFormatter(value: Dinero<number>) {
            const { scale } = toSnapshot(value)

            function transformer({ value, currency }: TransformerOptions<number, string>) {
                const numberFormat = Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: currency.code,
                    maximumFractionDigits: scale,
                })

                const result = numberFormat.formatToParts(Number(value))
                    .filter(part => !isCurrencyPart(part.type))
                    .map(part => part.value)
                    .join("")

                return result
            }

            return toDecimal(value, transformer)
        }
    }
}

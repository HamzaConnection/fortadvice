import { FluentBundle, FluentResource } from "@fluent/bundle"
import { negotiateLanguages } from "@fluent/langneg"
import { Logger } from '../../lib/logging'
import { Translations, translations } from "./translations"
import { MRT_Localization_DA } from "material-react-table/locales/da"
import { MRT_Localization_EN } from "material-react-table/locales/en"
import { MRT_Localization } from 'material-react-table'
const RE_ENUM_REPLACE = /_/g


export const DEFAULT_LOCALE = "da-DK"
const RE_VALID_KEY = /^(-?[a-zA-Z][\w-]*)$/
const logger = new Logger("localization")

const isValidKey = (key: string): boolean => RE_VALID_KEY.test(key)


// We take the json object from translations and converts it to the fluent format FTL.
export function buildFtl(locale: string, messages: Record<string, string>): string {
    let ftl = "";
    for (const [key, value] of Object.entries(messages)) {
        ftl += `${key} = ${value}\n\n`

        if (!isValidKey(key)) {
            // tests for syntax errors
            // Fluent doesn't seem to report syntax errors in any way
            logger.warn(`Invalid key in translation for ${locale}: '${key}' [will use fallback text]`)
        }
    }
    return ftl
}

// takes the supportd locals or saved locales and finds the best match. navigator.language is locales from the browser
export function pickBestLocale(supportedLocales: string[], savedUserLocale?: string): string[] {
    const userLocales = savedUserLocale ? [savedUserLocale, ...navigator.languages] : navigator.languages

    logger.info("Picking best match between user locales and supported locales", userLocales, supportedLocales)

    // There will only ever be 1 selected local either default or suported or default locale
    const selectedLocales = negotiateLanguages(userLocales, supportedLocales, { strategy: "lookup", defaultLocale: DEFAULT_LOCALE })
    logger.info("Selected locales", selectedLocales)

    return selectedLocales
}

export function* generateBundles(selectedLocales: string[], translations: Translations): Iterable<FluentBundle> {
    logger.info("Generating bundles for locales and translations", selectedLocales, translations)
    for (const locale of selectedLocales) {
        if (typeof translations[locale] === "object") {
            const messages = translations[locale]
            logger.info(`Building bundle for ${locale} with ${Object.keys(messages).length} messages`)
            const ftl = buildFtl(locale, messages)
            const resource = new FluentResource(ftl)
            const bundle = new FluentBundle(locale)
            bundle.addResource(resource)
            yield bundle
        }
    }
}


export function getTranslationIdForEnum(base: string, enumValue: string) {
    const transformedEnumVal = enumValue.toLowerCase().replace(RE_ENUM_REPLACE, "-")
    const id = `${base}-${transformedEnumVal}`
    return id
}

const mrtTranslations: Record<string, MRT_Localization> = {
    "da-DK": MRT_Localization_DA,
    "en-US": MRT_Localization_EN
}

export function getMaterialReactTableTranslation(locale: string) {
    const logger = new Logger("localization")
    const translation = mrtTranslations[locale]
    const selectedTranslation = translation ?? MRT_Localization_EN

    if (translation) {
        logger.info(`Selected Material React Table translation for '${locale}'`)
    } else {
        logger.info(`No translation loaded for '${locale}' [using fallback for: 'en']`)
    }

    return selectedTranslation
}

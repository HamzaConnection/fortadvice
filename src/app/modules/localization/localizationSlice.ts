import { isEqual } from "lodash-es"
import type { Draft } from "immer"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { Translations, translations } from "./translations"
import { DEFAULT_LOCALE, pickBestLocale } from "./localizationLib"

type LocalizationState = Readonly<{
    supportedLocales: string[]
    requestedLocale: string | undefined
    selectedLocales: string[]
    selectedLocale: string
    loadedTranslations: Translations
}>

const initialState: LocalizationState = {
    supportedLocales: Object.keys(translations),
    requestedLocale: undefined,
    selectedLocales: [DEFAULT_LOCALE],
    selectedLocale: DEFAULT_LOCALE,
    loadedTranslations: translations,
}

function selectLocales(supportedLocales: string[], requestedLocale: string | undefined) {
    const selectedLocales = pickBestLocale(supportedLocales, requestedLocale)
    const selectedLocale = selectedLocales[0]
    return { selectedLocales, selectedLocale }
}

function renegotiateLocales(state: Draft<LocalizationState>) {
    const { selectedLocales, selectedLocale } = selectLocales(state.supportedLocales, state.requestedLocale)

    if (!isEqual(state.selectedLocales, selectedLocales)) {
        state.selectedLocales = selectedLocales
    }

    if (state.selectedLocale !== selectedLocale) {
        state.selectedLocale = selectedLocale
    }
}

const localizationSlice = createSlice({
    name: "localization",
    initialState,
    reducers: {
        addSupportedLocales: (state, action: PayloadAction<{ locales: string[] }>) => {
            const set = new Set(action.payload.locales)

            for (const locale of state.supportedLocales) {
                set.add(locale)
            }

            state.supportedLocales = [...set]
            renegotiateLocales(state)
        },
        setRequestedLocale: (state, action: PayloadAction<{ locale: string }>) => {
            state.requestedLocale = action.payload.locale
            renegotiateLocales(state)
        },
        setTranslation: (state, action: PayloadAction<{ locale: string, translation: Record<string, string> }>) => {
            const { locale, translation } = action.payload
            state.loadedTranslations[locale] = translation
        }
    }
})

export const { addSupportedLocales, setRequestedLocale, setTranslation } = localizationSlice.actions
export const localizationReducer = localizationSlice.reducer

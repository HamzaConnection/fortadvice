import { RootState } from "../store/store";

export function selectSupportedLocales({ localization }: RootState) {
    return localization.supportedLocales
}

export function selectSelectedLocales({ localization }: RootState) {
    return localization.selectedLocales
}

export function selectSelectedLocale({ localization }: RootState) {
    return localization.selectedLocale
}

export function selectLoadedTranslations({ localization }: RootState) {
    return localization.loadedTranslations
}

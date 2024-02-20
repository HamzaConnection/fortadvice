import { useCallback } from "react"
import { useAppSelector } from "../store/storeHooks"
import { selectSelectedLocale, selectSupportedLocales } from "./localizationSelectors"
import { useDispatch } from "react-redux"
import { setRequestedLocale } from "./localizationSlice"

export function useLocaleSelect() {
    const supportedLocales = useAppSelector(selectSupportedLocales)
    const selectedLocale = useAppSelector(selectSelectedLocale)
    const dispatch = useDispatch()

    const selectLocale = useCallback(
        (locale: string) => dispatch(setRequestedLocale({ locale })),
        [dispatch, setRequestedLocale],
    )

    return {
        supportedLocales,
        selectedLocale,
        selectLocale,
    }
}

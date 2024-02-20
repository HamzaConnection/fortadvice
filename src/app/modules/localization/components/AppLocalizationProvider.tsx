import { Children, createContext, PropsWithChildren, useContext, useMemo } from "react"
import { LocalizationProvider, ReactLocalization } from "@fluent/react"
import { Logger } from '../../../lib/logging'
import { useAppSelector } from "../../store/storeHooks"
import { generateBundles } from '../localizationLib'
import { AppLocalization } from "../appLocalization"
import { selectLoadedTranslations, selectSelectedLocales } from "../localizationSelectors"

type InternalAppLocalizationContext = Readonly<{
    l10n?: AppLocalization
}>

export type AppLocalizationContextType = Required<InternalAppLocalizationContext>

const initialContext: InternalAppLocalizationContext = {}

const AppLocalizationContext = createContext<InternalAppLocalizationContext>(initialContext)

type AppLocalizationProviderProps = Readonly<PropsWithChildren<{}>>

export function AppLocalizationProvider({ children }: AppLocalizationProviderProps) {
    const logger = new Logger("localization")

    const selectedLocales = useAppSelector(selectSelectedLocales)
    const loadedTranslations = useAppSelector(selectLoadedTranslations)

    const l10n = useMemo(() => {
        logger.info("Generating localization for locales", selectedLocales)
        const bundles = generateBundles(selectedLocales, loadedTranslations)
        return new ReactLocalization(bundles)
    }, [selectedLocales, loadedTranslations])

    const appLocalization = useMemo(() => new AppLocalization(l10n), [l10n])

    const ctx = useMemo(() => ({
        l10n: appLocalization,
    }), [appLocalization])

    return (
        <AppLocalizationContext.Provider value={ctx}>
            <LocalizationProvider l10n={l10n}>
                {Children.only(children)}
            </LocalizationProvider>
        </AppLocalizationContext.Provider>
    )
}

export function useAppLocalization(): AppLocalizationContextType {
    const internalCtx = useContext(AppLocalizationContext)
    const { l10n } = internalCtx

    const context = useMemo(() => ({
        l10n: l10n!,
    }), [internalCtx])

    if (!l10n) {
        throw new Error("useAppLocalization was used without wrapping it in an <AppLocalizationProvider />.")
    }

    return context
}

import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { PropsWithChildren } from "react"
import { useSelector } from "react-redux"
import { selectSelectedLocale } from "../localizationSelectors"
import { useAppLocalization } from "./AppLocalizationProvider"

type MuiLocalizationProviderProps = Readonly<PropsWithChildren<{}>>

export function MuiLocalizationProvider({ children }: MuiLocalizationProviderProps) {
    const selectedLocale = useSelector(selectSelectedLocale)
    const { l10n } = useAppLocalization()

    return (
        <LocalizationProvider
            dateAdapter={AdapterLuxon}
            adapterLocale={selectedLocale}
            dateFormats={{ keyboardDate: l10n.getString("date-time-format-date") }}
        >
            {children}
        </LocalizationProvider>
    )
}

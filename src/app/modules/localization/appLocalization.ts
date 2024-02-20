import { FluentVariable } from "@fluent/bundle"
import { ReactLocalization } from "@fluent/react"
import { getTranslationIdForEnum } from "./localizationLib"
import { TranslationKey } from "./translations"

export class AppLocalization {
    private localization: ReactLocalization

    constructor(localization: ReactLocalization) {
        this.localization = localization
    }

    getString(translationId: TranslationKey, args: Record<string, FluentVariable> | undefined = undefined): string {
        return this.localization.getString(translationId, args, translationId)
    }

    getStringForEnum(base: string, enumValue: string, fallback: string, args: Record<string, FluentVariable> | undefined = undefined) {
        const translationId = getTranslationIdForEnum(base, enumValue)
        return this.localization.getString(translationId, args, fallback)
    }
}

import { defaults } from "lodash-es"
import { Logger } from "../../lib/logging"
import { AppContext } from "./contextTypes"

const CONTEXT_SETTINGS_TYPE = "gopay-manager-context-settings"

export type ContextSettings = Readonly<{
    type: `${typeof CONTEXT_SETTINGS_TYPE}`
    stack: AppContext[]
}>

const contextSettingsTemplate = {
    type: undefined,
    stack: undefined,
}

function isContextSettings(value: unknown): value is ContextSettings {
    if (value === null || typeof value !== "object") return false

    const contextSettings = defaults(value, contextSettingsTemplate)

    if (contextSettings.type !== CONTEXT_SETTINGS_TYPE) return false

    if (typeof contextSettings.stack !== "object") return false
    if (!Array.isArray(contextSettings.stack)) return false

    return true
}

export function tryLoadContextSettings(storage: Storage | undefined, key: string): ContextSettings | undefined {
    if (!storage) return undefined
    const logger = new Logger("login")

    try {
        const json = storage.getItem(key)
        if (json === null) return undefined

        const rawContextSettings = JSON.parse(json)
        const contextSettings = isContextSettings(rawContextSettings) ? rawContextSettings : undefined

        return contextSettings
    } catch (e: unknown) {
        logger.warn("Failed to load context settings", e)
        return undefined
    }
}

export function trySaveContextSettings(storage: Storage | undefined, key: string, stack: AppContext[]) {
    if (!storage) return
    const logger = new Logger("login")

    try {
        const contextSettings: ContextSettings = {
            type: CONTEXT_SETTINGS_TYPE,
            stack,
        }

        const json = JSON.stringify(contextSettings)
        storage.setItem(key, json)

    } catch (e: unknown) {
        logger.warn("Failed to save context settings", e)
    }
}

import { Logger } from "../../lib/logging"
import { safeParseFromJson } from "../../lib/lang"
import { AuthenticationUser } from "./loginTypes"

export type UsernameSettings = Readonly<{
    version: number
    username: string
}>

export type LoginSettings = Readonly<{
    version: number
    authToken: string
    user: AuthenticationUser
}>

const MAX_SUPPORTED_VERSION = 1

const usernameTemplate = {
    version: undefined,
    username: undefined,
}

const userTemplate = {
    companyId: undefined,
    id: undefined,
    username: undefined,
    displayInitials: undefined,
    userType: undefined,
}

const settingsTemplate = {
    version: undefined,
    authToken: undefined,
    user: undefined,
}

function isUsernameSettings(value: unknown): value is UsernameSettings {
    if (value === null || typeof value !== "object") return false

    const usernameSettings = { ...usernameTemplate, ...value }

    if (typeof usernameSettings.version !== "number") return false
    if (usernameSettings.version > MAX_SUPPORTED_VERSION) return false

    if (typeof usernameSettings.username !== "string") return false
    if (!usernameSettings.username) return false

    return true
}

function isAuthenticationUser(value: unknown): value is AuthenticationUser {
    if (value === null || typeof value !== "object") return false

    const user = { ...userTemplate, ...value }
    if (typeof user.companyId !== "number") return false
    if (typeof user.displayInitials !== "string") return false
    if (typeof user.id !== "number") return false
    if (typeof user.userType !== "string") return false
    if (typeof user.username !== "string") return false

    return true
}

function isLoginSettings(value: unknown): value is LoginSettings {
    if (value === null || typeof value !== "object") return false

    const loginSettings = { ...settingsTemplate, ...value }

    if (typeof loginSettings.version !== "number") return false
    if (loginSettings.version > MAX_SUPPORTED_VERSION) return false

    if (typeof loginSettings.authToken !== "string" || !loginSettings.authToken) return false
    if (typeof loginSettings.user !== "object" || !isAuthenticationUser(loginSettings.user)) return false

    return true
}

export function tryLoadUsernameSettings(storage: Storage | undefined, key: string): UsernameSettings | undefined {
    if (!storage) return undefined
    const logger = new Logger("login")

    try {
        const json = storage.getItem(key)
        const rawUsernameSettings = safeParseFromJson(json, logger)
        const usernameSettings = isUsernameSettings(rawUsernameSettings) ? rawUsernameSettings : undefined
        return usernameSettings

    } catch (e: unknown) {
        logger.warn("Failed to load username settings", e)
        return undefined
    }
}

export function trySaveUsernameSettings(storage: Storage | undefined, key: string, username: string) {
    if (!storage) return
    const logger = new Logger("login")

    try {
        const usernameSettings: UsernameSettings = {
            version: MAX_SUPPORTED_VERSION,
            username,
        }

        const json = JSON.stringify(usernameSettings)
        storage.setItem(key, json)

    } catch (e: unknown) {
        logger.warn("Failed to save username settings", e)
    }
}

export function clearUsernameSettings(storage: Storage |  undefined, key: string) {
    if (!storage) return
    storage.removeItem(key)
}

export function tryLoadLoginSettings(storage: Storage | undefined, key: string): LoginSettings | undefined {
    if (!storage) return undefined
    const logger = new Logger("login")

    try {
        const json = storage.getItem(key)
        const rawLoginSettings = safeParseFromJson(json, logger)
        const loginSettings = isLoginSettings(rawLoginSettings) ? rawLoginSettings : undefined
        return loginSettings

    } catch (e: unknown) {
        logger.warn("Failed to load login settings", e)
        return undefined
    }
}

export function trySaveLoginSettings(storage: Storage | undefined, key: string, authToken: string, user: AuthenticationUser) {
    if (!storage) return
    const logger = new Logger("login")

    try {
        const loginSettings: LoginSettings = {
            version: MAX_SUPPORTED_VERSION,
            authToken,
            user,
        }

        const json = JSON.stringify(loginSettings)
        storage.setItem(key, json)

    } catch (e: unknown) {
        logger.warn("Failed to save login settings", e)
    }
}

export function clearLoginSettings(storage: Storage | undefined, key: string) {
    if (!storage) return
    storage.removeItem(key)
}

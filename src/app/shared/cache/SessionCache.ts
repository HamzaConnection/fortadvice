import { AuthenticationUser } from '../../modules/login/loginTypes'
import { clearLoginSettings, tryLoadLoginSettings, trySaveLoginSettings } from '../../modules/login/loginStorage'
import { tryLoadContextSettings, trySaveContextSettings } from '../../modules/context/contextStorage'
import { AppContext } from '../../modules/context/contextTypes'

const APP_BASE_KEY = "gopay.menu.manager"

export enum StorageKey {
    LOGIN = "login",
    CONTEXT = "context",
}

function getKey(key: StorageKey) {
    return `${APP_BASE_KEY}.${key}`
}

const get = (key: StorageKey) => {
    return sessionStorage.getItem(getKey(key))
}

const set = (key: StorageKey, value: string) => {
    sessionStorage.setItem(getKey(key), value)
}

const remove = (key: StorageKey) => {
    sessionStorage.removeItem(getKey(key))
}


/**
 * Used to quick get and set value in the browsers session storage
 * @returns exposed methods, get and set
 */

export const SessionCache = () => {

    const getLoginSettings = () => tryLoadLoginSettings(sessionStorage, getKey(StorageKey.LOGIN))
    const setLoginSettings = (authToken: string, user: AuthenticationUser) => trySaveLoginSettings(sessionStorage, getKey(StorageKey.LOGIN), authToken, user)
    const removeLoginSettings = () => clearLoginSettings(sessionStorage, getKey(StorageKey.LOGIN))

    const getContextSettings = () => tryLoadContextSettings(sessionStorage, getKey(StorageKey.CONTEXT))
    const setContextSettings = (stack: AppContext[]) => trySaveContextSettings(sessionStorage, getKey(StorageKey.CONTEXT), stack)

    return {
        getLoginSettings,
        setLoginSettings,
        removeLoginSettings,
        getContextSettings,
        setContextSettings,
        get,
        set,
        remove,
    }
}

import { clearUsernameSettings, tryLoadUsernameSettings, trySaveUsernameSettings } from '../../modules/login/loginStorage'

const APP_BASE_KEY = "gopay.menu.manager"

export enum StorageKey {
    USERNAME = "username",
    CONTROL_KITCHEN_MODE = "control-kitchen-mode"
}

function getKey(key: StorageKey) {
    return `${APP_BASE_KEY}.${key}`
}

/**
 * Used to quick get and set value in the browsers local storage
 * @returns exposed methods, get and set
 */

const get = (key: StorageKey) => {
    return localStorage.getItem(getKey(key))
}

const set = (key: StorageKey, value: string) => {
    localStorage.setItem(getKey(key), value)
}
export const LocalCache = () => {
    const getUsernameSettings = () => tryLoadUsernameSettings(localStorage, getKey(StorageKey.USERNAME))
    const setUsernameSettings = (username: string) => trySaveUsernameSettings(localStorage, getKey(StorageKey.USERNAME), username)
    const removeUsernameSettings = () => clearUsernameSettings(localStorage, getKey(StorageKey.USERNAME))

    return {
        getUsernameSettings,
        setUsernameSettings,
        removeUsernameSettings,
        get,
        set,
    }
}

import { createEnumChecker } from "../../lib/enums"
import { EnvironmentType, EnvironmentMap, Environment, EnvironmentVariable, CurrentEnvironment } from "./envTypes"

const localhost = "http://localhost:3000"

const isEnvironmentType = createEnumChecker(EnvironmentType)

const getHost = (env: EnvironmentType) => env === EnvironmentType.Local ? localhost : `https://${env}.facilitynet.dk`

const getWebappUrl = (env: EnvironmentType) => `${getHost(env)}/gopay-manager`

const getApiUrl = (env: EnvironmentType) => {
    const envToUse = env === EnvironmentType.Local ? EnvironmentType.Test : env
    return `${getHost(envToUse)}/api`
}

const environmentList: Environment[] = Object.values(EnvironmentType)
    .map(e => ({
        type: e,
        webapp: {
            baseUrl: getWebappUrl(e),
        },
        api: {
            baseUrl: getApiUrl(e)
        }
    }))

const environments = environmentList.reduce((m, e) => ({
    [e.type]: e,
    ...m
}), {} as EnvironmentMap)

export const getEnvVariable = (envVar: EnvironmentVariable) => process.env[envVar]

export function getCurrentEnvironmentType() {
    const envStr = getEnvVariable(EnvironmentVariable.TARGET_ENV)
    if (envStr && isEnvironmentType(envStr)) {
        return envStr
    }
    return EnvironmentType.Local
}

export function createEnvironment() {
    const currentEnvType = getCurrentEnvironmentType()
    const deployPath = getEnvVariable(EnvironmentVariable.DEPLOY_PATH)
    const deployTime = getEnvVariable(EnvironmentVariable.DEPLOY_TIME)
    const deployInfo = deployTime ? { deployPath, deployTime } : undefined

    const currentEnv: CurrentEnvironment = {
        type: currentEnvType,
        webapp: {
            baseUrl: getEnvVariable(EnvironmentVariable.APP_URL) ?? env(currentEnvType).webapp.baseUrl,
            version: getEnvVariable(EnvironmentVariable.APP_VERSION) ?? "LIVE",
            versionFull: getEnvVariable(EnvironmentVariable.APP_VERSION_FULL) ?? "LIVE",
            ...deployInfo,
        },
        api: {
            baseUrl: getEnvVariable(EnvironmentVariable.API_ENDPOINT) ?? env(currentEnvType).api.baseUrl
        },
    }

    return currentEnv
}

export const env = (type: EnvironmentType) => environments[type]

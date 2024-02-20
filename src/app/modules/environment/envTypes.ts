export enum EnvironmentVariable {
    TARGET_ENV = "REACT_APP_TARGET_ENV",
    APP_URL = "REACT_APP_URL",
    WEBAPP_URL = "REACT_APP_WEBAPP_URL",
    APP_VERSION = "REACT_APP_VERSION",
    APP_VERSION_FULL = "REACT_APP_VERSION_FULL",
    API_ENDPOINT = "REACT_APP_API_ENDPOINT",
    DEPLOY_PATH = "REACT_APP_DEPLOY_PATH",
    DEPLOY_TIME = "REACT_APP_DEPLOY_TIME",
    INTERCOM_APPID = "REACT_APP_INTERCOM_APPID",
}

export enum EnvironmentType {
    Local = "local",
    Test = "test",
    Demo = "demo",
    QA = "qa",
    Prod = "prod"
}

export type Webapp = Readonly<{
    baseUrl: string
}>

export type Api = Readonly<{
    baseUrl: string
}>

export type Environment = Readonly<{
    type: EnvironmentType
    webapp: Webapp
    api: Api
}>

export type CurrentWebapp = Readonly<{
    baseUrl: string
    version: string
    versionFull: string
    deployPath?: string
    deployTime?: string
}>

export type CurrentApi = Readonly<{
    baseUrl: string
}>

export type CurrentEnvironment = Readonly<{
    type: EnvironmentType
    webapp?: CurrentWebapp
    api: CurrentApi
}>

export type EnvironmentMap = Record<EnvironmentType, Environment>

export type EnvironmentState = Readonly<{
    current: CurrentEnvironment
}>

export type EnvironmentStore = Readonly<{
    environment: EnvironmentState
}>

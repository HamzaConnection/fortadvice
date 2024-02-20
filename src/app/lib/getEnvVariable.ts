import { EnvironmentVariable } from '../constants/EnvironmentVariable';

export const getEnvVariable = (envVar: EnvironmentVariable) => process.env[envVar]

import { useMemo } from "react"
import { createEnvironment, getCurrentEnvironmentType } from "./environment"

export function useEnvironment() {
    const currentEnvType = getCurrentEnvironmentType()
    const currentEnv = useMemo(() => createEnvironment(), [currentEnvType])

    return {
        currentEnv
    }
}

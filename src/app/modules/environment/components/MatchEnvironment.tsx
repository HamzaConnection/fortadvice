import { PropsWithChildren } from "react"
import { EnvironmentType } from "../envTypes"
import { useEnvironment } from "../envHooks"

type MatchEnvironmentProps = Readonly<PropsWithChildren<{
    environments: EnvironmentType[]
}>>

export function MatchEnvironment({ environments, children }: MatchEnvironmentProps) {
    const { currentEnv } = useEnvironment()

    if (environments.includes(currentEnv.type)) {
        return (
            <>
                {children}
            </>
        )
    }

    return null
}

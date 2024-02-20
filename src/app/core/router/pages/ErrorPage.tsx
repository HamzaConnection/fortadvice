import { ErrorView } from '../../../shared/components/errors/ErrorView'
import { useLocationState } from '../routerHooks'

export type ErrorPageState = Readonly<{
    title: string
    message: string
}>

type ErrorPageProps = Readonly<{}>

export function ErrorPage({ }: ErrorPageProps) {
    const state = useLocationState<ErrorPageState>({
        title: "Unknown Error",
        message: "An unexpected error occurred. Please contact support"
    })

    return (
        <ErrorView title={state.title} message={state.message} />
    )
}

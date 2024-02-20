import { Component, PropsWithChildren } from "react"
import { ErrorView } from "./ErrorView"
import { LocalizedStrict } from "../../../modules/localization/components/AppLocalized"

type ErrorBoundaryModalProps = Readonly<
    PropsWithChildren<{
        onClose: () => void
    }>
>

type ErrorBoundaryModalState = Readonly<{
    hasError: boolean
}>

export class ErrorBoundaryModal extends Component<ErrorBoundaryModalProps, ErrorBoundaryModalState> {
    public static getDerivedStateFromError(error: unknown): ErrorBoundaryModalState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    constructor(props: ErrorBoundaryModalProps) {
        super(props)
        this.state = {
            hasError: false,
        }
    }

    public useEffect() {
        this.setState({ hasError: false })
    }

    public componentDidCatch(error: unknown, errorInfo: unknown) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <LocalizedStrict id="error-boundary-modal"
                    attrs={{ title: true, message: true, buttonLabel: true }}
                    vars={{ errorCode: "E_ERROR_BOUNDARY_UNKNOWN" }}
                >
                    <ErrorView
                        title="Something went wrong"
                        message="Error code: E_ERROR_BOUNDARY_UNKNOWN"
                        buttonLabel="Click here to close modal"
                        onClose={() => {
                            this.setState({ hasError: false })
                            this.props.onClose()
                        }}
                    />
                </LocalizedStrict>
            )
        }

        return this.props.children
    }
}

import { Component, PropsWithChildren } from "react"
import { ErrorView } from "./ErrorView"
import { LocalizedStrict } from "../../../modules/localization/components/AppLocalized"
import { Card, CardMedia, CardContent, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

type CardErrorBoundaryProps = Readonly<
    PropsWithChildren<{
    }>
>

type CardErrorBoundaryState = Readonly<{
    hasError: boolean
}>

// TODO ask søren how to make this currently NOT being used
export class CardErrorBoundary extends Component<CardErrorBoundaryProps, CardErrorBoundaryState> {
    public static getDerivedStateFromError(error: unknown): CardErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    constructor(props: CardErrorBoundaryProps) {
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

        const useStyles = makeStyles()((theme) => ({
            newsGrid: {
                justifyContent: "center",
                border: 'none',
                alignSelf: 'baseline',
                "&:hover": {
                    transform: "scale(1.02)",
                    transition: 'all .3s ease-in-out'
                }
            },
            card: {
                width: "32%", // set according to gap %
                cursor: 'pointer',
                [theme.breakpoints.down(1000)]: {
                    width: "49%", // set according to gap %
                },

                [theme.breakpoints.down("sm")]: {
                    width: "100%",
                },
            },


        }))

        const { classes, cx } = useStyles()
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <Card variant='outlined' className={cx(classes.newsGrid, classes.card)}>
                    <CardContent sx={{ padding: "0", paddingTop: '0.3rem' }}>
                        <Typography variant="h6" fontWeight={400}>
                            Failed to display
                        </Typography>
                    </CardContent>
                </Card >
            )
        }

        return this.props.children
    }
}

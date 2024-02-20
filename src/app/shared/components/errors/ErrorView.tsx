import { Player, IPlayerProps } from "@lottiefiles/react-lottie-player"
import { Typography, Grid, Container } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { StandardFloatingButton } from "../buttons/StandardFloatingButton"
import GeneralErrorAnim from "../../assets/general-error-lottie-anim.json"


interface IProps {
    lottieAnimation?: IPlayerProps["src"]
    title: string
    message?: string
    buttonLabel?: string
    withBottomNavbar?: boolean
    onClose?: () => void
}

const useStyles = makeStyles()((theme) => ({

    container: {
        height: '80%',
        paddingBottom: 90
    },

    player: {
        [theme.breakpoints.down("sm")]: {
            // Adjust background image position on mobile landscape
            width: 'auto'
        },
        width: '50rem'
    },


}))

export function ErrorView(props: IProps) {
    const {
        lottieAnimation = GeneralErrorAnim,
        title,
        message,
        buttonLabel,
        withBottomNavbar,
        onClose,
    } = props

    const { classes } = useStyles()

    return (
        <Container >
            <Grid container direction="column" wrap="nowrap" justifyContent="space-evenly" alignItems={"center"}>
                <Grid item>
                    <Player autoplay loop controls={false} src={lottieAnimation} className={classes.player} />
                </Grid>

                <Grid item>
                    <Typography variant="h6" align="center" paragraph>
                        {title}
                    </Typography>
                </Grid>

                {message && (
                    <Grid item>
                        <Typography variant="subtitle1" align="center" paragraph>
                            {message}
                        </Typography>
                    </Grid>
                )}
            </Grid>


            {onClose && (
                <StandardFloatingButton
                    onClick={onClose}
                    withBottomNavbar={withBottomNavbar}
                >
                    {buttonLabel ?? "Close"}
                </StandardFloatingButton>
            )}
        </Container>
    )
}

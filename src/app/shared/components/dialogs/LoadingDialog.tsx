import { useEffect, useRef, useState } from "react"
import { CircularProgress, Dialog, DialogContent, Grid } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { IPlayerProps, Player, PlayerEvent } from "@lottiefiles/react-lottie-player"
import { useTimeout } from "../../hooks/useTimeout"

const defaultDelayBeforeShowingInMillis = 1000

const useStyles = makeStyles()((theme) => ({
    // Need a container with padding to fix grid creating unnecessary scrollbars
    // See: https://github.com/mui-org/material-ui/issues/7466
    container: {
        padding: theme.spacing(5)
    },
}))

interface Props {
    loading: boolean
    description?: string
    lottieAnim?: IPlayerProps["src"]
    lottieSpeed?: number
    lottieStartFrame?: number
    lottieStopFrame?: number
}

export function LoadingDialog({ loading, description, lottieAnim, lottieSpeed, lottieStartFrame, lottieStopFrame }: Props) {
    const { classes } = useStyles()
    const [open, setOpen] = useState(false)
    const [animComplete, setAnimComplete] = useState(!!!lottieAnim) // don't wait if no animation
    const lottiePlayer = useRef<Player | null>(null)
    // TODO: Take value from Redux when it becomes available there
    //const delayInMillis = lottieAnim ? null : useSelector(selectLoadingIndicatorDelayInMillis) ?? defaultDelayBeforeShowingInMillis
    const delayInMillis = lottieAnim ? null : defaultDelayBeforeShowingInMillis

    useTimeout(() => setOpen(loading), delayInMillis)

    useEffect(() => {
        if (loading && !open) setOpen(true)

        // Auto-close when no longer loading but only after finishing one anim loop
        if (!loading && animComplete) setOpen(false)
    }, [loading, animComplete])

    function playAnimation(player: Player) {
        if (!loading) {
            return
        }

        if (lottieStartFrame) {
            player.setSeeker(lottieStartFrame, true)
        } else {
            player.setSeeker(0, true)
        }

        player.play()
    }

    function handleLottieEvent(event: PlayerEvent) {
        if (lottiePlayer.current) {
            switch (event) {
                case PlayerEvent.Load:
                    playAnimation(lottiePlayer.current)
                    break
                case PlayerEvent.Complete:
                    setAnimComplete(true)
                    // If we are still loading perform a manual loop of the animation
                    playAnimation(lottiePlayer.current)
                    break
                case PlayerEvent.Frame:
                    if (lottieStopFrame !== undefined &&
                        lottiePlayer.current.state.seeker >= lottieStopFrame) {
                        setAnimComplete(true)
                        // NOTE: We cannot implement manual looping here since the seeker
                        // state is asynchronously updated so we end up in an infinite loop
                        // See: https://github.com/LottieFiles/lottie-react/issues/22
                        lottiePlayer.current.setLoop(true)
                    }
                    break
            }
        }
    }

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogContent>
                <div className={classes.container}>
                    <Grid container direction="column" spacing={4} justifyContent="space-evenly" alignItems="center">
                        {description && (
                            <Grid item xs>
                                {description}
                            </Grid>
                        )}
                        {lottieAnim !== undefined ? (
                            <Player ref={lottiePlayer} src={lottieAnim} onEvent={handleLottieEvent} speed={lottieSpeed} keepLastFrame controls={false} />
                        ) : (
                            <Grid item xs>
                                <CircularProgress size={40} />
                            </Grid>
                        )}
                    </Grid>
                </div>
            </DialogContent>
        </Dialog>
    )
}

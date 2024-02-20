import { forwardRef } from "react"
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Zoom,
    ZoomProps,
} from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { IPlayerProps, Player } from "@lottiefiles/react-lottie-player"
import Linkify from 'react-linkify'
import { ExternalLink } from '../links/ExternalLink'
import { StandardButton } from "../buttons/StandardButton"


const useStyles = makeStyles()((theme) => ({
    title: {
        textAlign: "center",
    },
    message: {
        textAlign: "center",
    },
    closeButton: {
        padding: theme.spacing(3),
    },
}))

type MessageDialogProps = Readonly<{
    name: string
    title: string
    message: string
    buttonLabel: string
    lottieAnim: IPlayerProps["src"]
    open: boolean
    onClose: () => void
    onClick?: () => void
}>

const transition = forwardRef(function Transition(
    props: ZoomProps,
    ref: React.Ref<unknown>
) {
    return <Zoom ref={ref} {...props} />
})

export function MessageDialog({ name, title, message, buttonLabel, lottieAnim, open, onClose, onClick }: MessageDialogProps) {
    const { classes } = useStyles()

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            scroll="body"
            fullWidth
            TransitionComponent={transition}
            aria-labelledby={`${name}-message-dialog-title`}
            aria-describedby={`${name}-message-dialog-message`}
        >
            <Player autoplay loop controls={false} src={lottieAnim} />
            <DialogTitle id={`${name}-message-dialog-title`} className={classes.title}>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id={`${name}-message-dialog-message`} className={classes.message}>
                    { /* NOTE: Docs are outdated, this is the way to do target: blank with the current API */ }
                    <Linkify componentDecorator={(href, text, key) => (
                        <ExternalLink key={key} color='primary' href={href}>{text}</ExternalLink>
                    )}>
                        {message}
                    </Linkify>
                </DialogContentText>
            </DialogContent>
            <DialogActions className={classes.closeButton}>
                <StandardButton variant="contained" fullWidth onClick={onClick ?? onClose}>
                    {buttonLabel}
                </StandardButton>
            </DialogActions>
        </Dialog>
    )
}

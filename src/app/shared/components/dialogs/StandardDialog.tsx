import { PropsWithChildren, ReactElement, ReactNode } from "react"
import { Breakpoint, Dialog, DialogProps, useMediaQuery, useTheme } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { useInView } from "react-intersection-observer"
import { ErrorBoundaryModal } from "../errors/ErrorBoundaryModal"
import { StandardTopbar } from "../skeleton/TopBar"
import { SafeArea } from "../skeleton/SafeArea"

type StyleProps = Readonly<{
    fullScreen: boolean
}>

const useStyles = makeStyles<StyleProps>()((theme, { fullScreen }) => ({
    // For wide screens we add blur to avoid distractions from dialog content
    dialogBackdrop: {
        [theme.breakpoints.up("sm")]: {
            backdropFilter: "blur(10px)",
        },
    },
    // This ensures that contained elements with position: fixed will be positioned relative to the paper instead of viewport
    // Specifically, this prevents top bar and floating buttons from ending up outside the dialog when it is not full screen
    // See: https://developer.mozilla.org/en-US/docs/Web/CSS/position
    dialogPaper: {
        transform: fullScreen ? undefined : "scaleX(1)"
    },
    scrollShadowBottom: {
        "&::after": {
            zIndex: 1,
            position: fullScreen ? "fixed" : "sticky",
            content: '"-"',
            bottom: "-25px",
            left: "0",
            width: "100%",
            boxShadow: "0 -5px 45px rgb(0 0 0 / 80%)"
        }
    },
    edge: {
        height: "10px"
    }
}))

type StandardDialogProps = Readonly<PropsWithChildren<{
    titleElement?: ReactNode
    topbar?: ReactElement
    open: boolean
    onClose: () => void
    maxWidthProp?: Breakpoint
    scroll?: DialogProps["scroll"]
}>>

export function StandardDialog({ titleElement, topbar, open, children, onClose, maxWidthProp = "sm", scroll = "paper" }: StandardDialogProps) {
    const { ref: bottomRef, inView: isAtBottom } = useInView({ threshold: 1.0 })
    const theme = useTheme()
    const wide = useMediaQuery(theme.breakpoints.up("sm"))

    // If we are on a wide display (tablet or desktop or landscape phone) we never use full screen
    const fullScreen = !wide

    const { classes, cx } = useStyles({ fullScreen })

    const topbarToUse = topbar ? topbar : (
        <StandardTopbar
            middleElement={titleElement}
            backButtonType="close"
            hideMenuButton
            onBackButton={onClose}
            onMenuButton={undefined}
        />
    )





    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={(fullScreen ? undefined : maxWidthProp)}
            fullWidth={(fullScreen ? undefined : true)}
            fullScreen={fullScreen}
            scroll={scroll}
            slotProps={{ backdrop: { classes: { root: classes.dialogBackdrop } } }}
            classes={{
                paper: classes.dialogPaper,
                paperScrollPaper: cx({
                    // TODO: We disable scroll shadow due to weird bug in Chrome
                    // with position:sticky causing the scroll to jump around
                    // Re-enable when we have time to debug the issue
                    [classes.scrollShadowBottom]: false  // !isAtBottom
                })
            }}
        >
            <ErrorBoundaryModal onClose={onClose}>
                <SafeArea>
                    {topbarToUse}
                    {children}
                    <div ref={bottomRef} className={classes.edge}></div>
                </SafeArea>
            </ErrorBoundaryModal>
        </Dialog>
    )
}

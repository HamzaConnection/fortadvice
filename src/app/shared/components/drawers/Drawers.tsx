import { CSSProperties, PropsWithChildren } from "react"
import { DialogActions, DialogActionsProps, DialogContent, DialogContentProps, DialogContentText, DialogTitle, Drawer, DrawerProps, IconButton, Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { Remark } from "react-remark"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes"
import { ErrorBoundaryModal } from "../errors/ErrorBoundaryModal"

type PaddingProps = Partial<Readonly<{
    top: CSSProperties["paddingTop"]
    bottom: CSSProperties["paddingBottom"]
    left: CSSProperties["paddingLeft"]
    right: CSSProperties["paddingRight"]
}>>

type StyleProps = Readonly<{
    header?: {
        variant?: StandardDrawerProps["headerVariant"]
        padding?: PaddingProps
    }
    content?: {
        padding?: PaddingProps
    }
    actions?: {
        padding?: PaddingProps
    }
}>

const DEFAULT_HORIZONTAL_PADDING = 4

const useStandardDrawerStyles = makeStyles<StyleProps>()((theme, { header, content, actions }) => ({
    drawerPaper: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    drawerHeader: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: header?.variant === "plain" ? "center" : "space-between",
        alignItems: "center",
        paddingTop: (header?.padding?.top !== undefined) ? header.padding.top : theme.spacing(3),
        paddingBottom: (header?.padding?.bottom !== undefined) ? header.padding.bottom : theme.spacing(2),
        paddingLeft: (header?.padding?.left !== undefined) ? header.padding.left : theme.spacing(DEFAULT_HORIZONTAL_PADDING),
        paddingRight: (header?.padding?.right !== undefined) ? header.padding.right : theme.spacing(DEFAULT_HORIZONTAL_PADDING),
    },
    drawerContent: {
        paddingTop: (content?.padding?.top !== undefined) ? content.padding.top : 0,
        paddingBottom: (content?.padding?.bottom !== undefined) ? content.padding.bottom : theme.spacing(3),
        paddingLeft: (content?.padding?.left !== undefined) ? content.padding.left : theme.spacing(DEFAULT_HORIZONTAL_PADDING),
        paddingRight: (content?.padding?.right !== undefined) ? content.padding.right : theme.spacing(DEFAULT_HORIZONTAL_PADDING),
    },
    drawerActions: {
        paddingTop: (content?.padding?.top !== undefined) ? content.padding.top : 0,
        paddingBottom: (content?.padding?.bottom !== undefined) ? content.padding.bottom : theme.spacing(3),
        paddingLeft: (content?.padding?.left !== undefined) ? content.padding.left : theme.spacing(DEFAULT_HORIZONTAL_PADDING),
        paddingRight: (content?.padding?.right !== undefined) ? content.padding.right : theme.spacing(DEFAULT_HORIZONTAL_PADDING),
    },
}))

type StandardDrawerContentProps = DialogContentProps & Readonly<{
    padding?: PaddingProps
}>

export function StandardDrawerContent({ dividers = true, padding, className, children, ...rest }: StandardDrawerContentProps) {
    const { classes, cx } = useStandardDrawerStyles({ content: { padding } })

    return (
        <DialogContent dividers={dividers} className={cx(classes.drawerContent, className)} {...rest}>
            {children}
        </DialogContent>
    )
}

type StandardDrawerActionsProps = DialogActionsProps & Readonly<{
    padding?: PaddingProps
}>

export function StandardDrawerActions({ padding, className, children, ...rest }: StandardDrawerActionsProps) {
    const { classes, cx } = useStandardDrawerStyles({ actions: { padding } })

    return (
        <DialogActions className={cx(classes.drawerActions, className)} {...rest}>
            {children}
        </DialogActions>
    )
}

type StandardDrawerProps = Readonly<PropsWithChildren<{
    name: string
    title: string
    headerVariant?: "closeable" | "plain"
    headerPadding?: PaddingProps
    headerClassName?: string
    open: boolean
    onClose: () => void
    ["aria-describedby"]?: DrawerProps["aria-describedby"]
}>>

export function StandardDrawer(props: StandardDrawerProps) {
    const {
        name,
        title,
        headerVariant = "closeable",
        headerPadding,
        headerClassName,
        open,
        onClose,
        children,
    } = props

    const { classes, cx } = useStandardDrawerStyles({ header: { variant: headerVariant, padding: headerPadding } })

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            aria-labelledby={`${name}-drawer-title`}
            PaperProps={{ square: false }}
            classes={{ paper: classes.drawerPaper }}
        >
            <ErrorBoundaryModal onClose={onClose}>
                <DialogTitle id={`${name}-drawer-title`} className={cx(classes.drawerHeader, headerClassName)}>
                    <Typography variant="h5">
                        {title}
                    </Typography>
                    {headerVariant === "closeable" && (
                        <IconButton onClick={onClose} edge="end" color="inherit" aria-label="close">
                            <FontAwesomeIcon icon={faTimes} color="grey" size="1x" />
                        </IconButton>
                    )}
                </DialogTitle>
                {children}
            </ErrorBoundaryModal>
        </Drawer>
    )
}

type DocumentDrawerProps = Readonly<{
    name: string
    title: string
    open: boolean
    onClose: () => void
    children: string
}>

const useDocumentDrawerStyles = makeStyles()((theme) => ({
    message: {
        textAlign: "left",
        fontSize: `calc(${theme.typography.body1.fontSize}*1.1)`,
    },
}))

export function DocumentDrawer({ name, title, open, onClose, children }: DocumentDrawerProps) {
    const { classes } = useDocumentDrawerStyles()

    return (
        <StandardDrawer
            name={name}
            title={title}
            open={open}
            onClose={onClose}
            aria-describedby={`${name}-drawer-content`}
        >
            <StandardDrawerContent dividers={false}>
                <DialogContentText
                    id={`${name}-drawer-content`}
                    variant="body1"
                    color="textPrimary"
                    component="div"
                    className={classes.message}
                >
                    <Remark>
                        {children}
                    </Remark>
                </DialogContentText>
            </StandardDrawerContent>
        </StandardDrawer>
    )
}

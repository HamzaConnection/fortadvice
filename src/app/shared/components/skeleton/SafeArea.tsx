import { PropsWithChildren } from 'react'
import { makeStyles } from "tss-react/mui"

type StyleProps = Readonly<{
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
    position: "relative" | undefined
    fullHeight: boolean
}>

const useStyles = makeStyles<StyleProps>({ name: { SafeArea } })((_theme, { top, bottom, left, right, position, fullHeight }) => ({
    envMargin: {
        marginTop: top ? "env(safe-area-inset-top)" : undefined,
        marginBottom: bottom ? "env(safe-area-inset-bottom)" : undefined,
        marginLeft: left ? "env(safe-area-inset-left)" : undefined,
        marginRight: right ? "env(safe-area-inset-right)" : undefined,
    },
    envPadding: {
        paddingTop: top ? "env(safe-area-inset-top)" : undefined,
        paddingBottom: bottom ? "env(safe-area-inset-bottom)" : undefined,
        paddingLeft: left ? "env(safe-area-inset-left)" : undefined,
        paddingRight: right ? "env(safe-area-inset-right)" : undefined,
    },
    root: {
        position: position,
        width: "100%",
        height: fullHeight ? "100%" : undefined,
    },
}))

type SafeAreaProps = Readonly<PropsWithChildren<{
    method?: "margin" | "padding"
    top?: boolean
    bottom?: boolean
    left?: boolean
    right?: boolean
    position?: "relative"
    fullHeight?: boolean
    className?: string
}>>

export function SafeArea(props: SafeAreaProps) {
    const {
        method = "padding",
        top = true,
        bottom = true,
        left = true,
        right = true,
        position,
        fullHeight = true,
        className,
    } = props

    const { classes, cx } = useStyles({ top, bottom, left, right, position, fullHeight })

    return (
        <div className={cx(className, classes.root, {
            [classes.envMargin]: method === "margin",
            [classes.envPadding]: method === "padding"
        })}>
            {props.children}
        </div>
    )
}

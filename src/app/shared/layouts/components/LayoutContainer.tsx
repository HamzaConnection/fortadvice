import { PropsWithChildren } from "react"
import { makeStyles } from "tss-react/mui"

type StyleProps = Readonly<{
    disableLeft: boolean
    disableRight: boolean
}>

const useStyles = makeStyles<StyleProps>()((theme, { disableLeft, disableRight }) => ({
    container: {
        width: "100%",
        paddingLeft: disableLeft ? undefined : "2rem",
        paddingRight: disableRight ? undefined : "2rem",
    }
}))

type Props = Readonly<PropsWithChildren<{
    disableLeft?: boolean
    disableRight?: boolean
}>>

// NOTE: This component is used across the nav layout to ensure consistent padding

export function LayoutContainer({ disableLeft = false, disableRight = false, children }: Props) {
    const { classes } = useStyles({ disableLeft, disableRight })

    return (
        <div className={classes.container}>
            {children}
        </div>
    )
}

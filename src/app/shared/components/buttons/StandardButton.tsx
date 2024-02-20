import { CSSProperties, forwardRef, Ref } from "react"
import { Button, ButtonProps } from "@mui/material"
import { orange } from "@mui/material/colors"
import { makeStyles } from "tss-react/mui"
import { StrictOmit } from "../../../lib/lang"
import { WellknownZIndex } from "../../../constants/wellknown"

type FloatingButton = {
    floating?: boolean | "sticky"
    zIndex?: number
    withBottomNavbar?: boolean
}


export type StandardButtonProps = StrictOmit<ButtonProps, "color"> & Readonly<{
    color?: ButtonProps["color"] | "black" | "white" | "orange"
    maxWidth?: "xl" | "lg" | "md" | "sm" | "xs" | false
    textTransform?: CSSProperties["textTransform"]
}> & FloatingButton

type StandardButtonStyleProps = Pick<StandardButtonProps, "size" | "maxWidth" | "floating" | "zIndex" | "textTransform"> & { bottom?: number }

export const useStandardButtonStyles = makeStyles<StandardButtonStyleProps>({})((theme, { size, maxWidth, bottom, zIndex, floating, textTransform }) => ({
    button: {
        padding: size === "small" ? "0.375rem 1rem" : size === "large" ? "0.75rem 1.375rem" : "0.625rem 1rem",
        borderRadius: size === "small" ? 12 : size === "large" ? 16 : 14,
        maxWidth: maxWidth ? theme.breakpoints.values[maxWidth] : undefined,
        textTransform,
    },
    buttonContained: {
        borderStyle: "none",
    },
    buttonContainedBlack: {
        color: theme.palette.getContrastText(theme.palette.common.black),
        backgroundColor: theme.palette.common.black,
        "&:hover": {
            backgroundColor: theme.palette.grey[900]
        },
    },
    buttonContainedWhite: {
        color: theme.palette.getContrastText(theme.palette.common.white),
        backgroundColor: theme.palette.common.white,
        "&:hover": {
            backgroundColor: theme.palette.grey[500],
        },
    },
    buttonContainedOrange: {
        color: theme.palette.getContrastText(orange[800]),
        backgroundColor: orange[800],
        "&:hover": {
            backgroundColor: orange[700],
        },
    },
    buttonOutlinedBlack: {
        color: theme.palette.common.black,
        borderColor: "rgb(0, 0, 0, 0.5)",
        "&:hover": {
            borderColor: theme.palette.common.black,
            backgroundColor: "rgb(0, 0, 0, 0.04)",
        },
    },
    buttonOutlinedWhite: {
        color: theme.palette.common.white,
        borderColor: "rgb(255, 255, 255, 0.5)",
        "&:hover": {
            borderColor: theme.palette.common.white,
            backgroundColor: "rgb(255, 255, 255, 0.04)",
        },
    },
    buttonOutlinedOrange: {
        color: orange[800],
        borderColor: "rgb(239, 108, 0, 0.5)",
        "&:hover": {
            borderColor: orange[800],
            backgroundColor: "rgb(239, 108, 0, 0.04)",
        },
    },
    floating: {
        width: 'auto',
        position: (floating === "sticky") ? "sticky" : "fixed",
        left: 15,
        right: 15,
        bottom: bottom,
        zIndex: zIndex,
        "&.Mui-disabled": {
            backgroundColor: "#eee",
        }
    },

}))

export const StandardButton = forwardRef((props: StandardButtonProps, ref: Ref<HTMLButtonElement>) => {
    const {
        variant = "contained",
        size = "large",
        fullWidth = true,
        maxWidth,
        disableElevation = true,
        color = "black",
        className,
        children,
        floating = false,
        withBottomNavbar = false,
        zIndex = WellknownZIndex.FLOATING_BUTTON,
        textTransform = 'none',
        ...rest
    } = props

    const bottomPosition = withBottomNavbar ? 90 : 40
    const { classes, cx } = useStandardButtonStyles({ size, maxWidth, floating, zIndex, bottom: bottomPosition, textTransform })

    return (
        <Button
            ref={ref}
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            disableElevation={floating ? false : disableElevation} // floating buttons must always be elevated
            color={(color === "black" || color === "white" || color === "orange") ? undefined : color}
            className={cx(className, {
                [classes.floating]: Boolean(floating),
                [classes.button]: true,
                [classes.buttonContained]: variant === "contained",

            })}
            classes={{
                root: cx({
                    [classes.buttonContainedBlack]: color === "black" && variant === "contained",
                    [classes.buttonContainedWhite]: color === "white" && variant === "contained",
                    [classes.buttonContainedOrange]: color === "orange" && variant === "contained",
                    [classes.buttonOutlinedBlack]: color === "black" && variant === "outlined",
                    [classes.buttonOutlinedWhite]: color === "white" && variant === "outlined",
                    [classes.buttonOutlinedOrange]: color === "orange" && variant === "outlined",
                }),
            }}
            {...rest}
        >
            {children}
        </Button>
    )
})

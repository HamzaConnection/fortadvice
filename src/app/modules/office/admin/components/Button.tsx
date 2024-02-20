import { Button as MuiButton, ButtonProps } from "@mui/material"
import React from "react"
import { makeStyles } from "tss-react/mui"

const useStyles = makeStyles()((theme) => ({
    button: {
        "&.MuiButton-root": {
            borderRadius: 8,
            padding: theme.spacing(2, 4),
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.2,
            textAlign: "center",
            color: theme.palette.common.white,
            backgroundColor: "#0F172A",
            textTransform: "none",
            "&:hover": {
                backgroundColor: "#0F172A",
            },
        },
    },
}))

export function Button({ children, className, ...props }: ButtonProps) {
    const { cx, classes } = useStyles()
    return (
        <MuiButton className={cx(classes.button, className)} {...props}>
            {children}
        </MuiButton>
    )
}

import { forwardRef, Ref } from "react"
import { IconButton, IconButtonProps } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinnerThird } from "@fortawesome/pro-light-svg-icons/faSpinnerThird"
import { StrictOmit } from "../../../lib/lang"
import { StandardButton, StandardButtonProps } from "./StandardButton"

type LoadingProps = Readonly<{
    loading: boolean
    loadingLabel?: React.ReactNode
    disabledLabel?: React.ReactNode
}>

export type StandardLoadingButtonProps = StrictOmit<StandardButtonProps, "href"> & LoadingProps

export const StandardLoadingButton = forwardRef((props: StandardLoadingButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { disabled, loading, loadingLabel, disabledLabel, endIcon, children, onClick, ...rest } = props
    const icon = loading ? (<FontAwesomeIcon icon={faSpinnerThird} spin />) : endIcon

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (loading) return
        onClick?.(event)
    }

    return (
        <StandardButton ref={ref} disabled={disabled || loading} endIcon={icon} onClick={handleClick} {...rest}>
            {(disabled && disabledLabel) ? disabledLabel : ((loading && loadingLabel) ? loadingLabel : children)}
        </StandardButton>
    )
})

type LoadingIconButtonProps = IconButtonProps & Readonly<{
    loading: boolean
}>

export function LoadingIconButton(props: LoadingIconButtonProps) {
    const { disabled, loading, children, onClick, ...rest } = props
    const icon = loading ? (<FontAwesomeIcon icon={faSpinnerThird} spin />) : children

    function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (loading) return
        if (onClick) onClick(e)
    }

    return (
        <IconButton disabled={disabled || loading} onClick={handleClick} {...rest}>
            {icon}
        </IconButton>
    )
}

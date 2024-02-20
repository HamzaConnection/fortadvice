import { forwardRef, Ref } from "react"
import { WellknownZIndex } from "../../../constants/wellknown"
import { StrictOmit } from "../../../lib/lang"
import { StandardLoadingButton, StandardLoadingButtonProps } from "./LoadingButton"

export type StandardFloatingButtonProps = StrictOmit<
    StandardLoadingButtonProps,
    "variant" | "size" | "fullWidth" | "disableElevation" | "zIndex" | "floating" | "loading"
> & {
    position?: "fixed" | "sticky"
    loading?: boolean
}

export const StandardFloatingButton = forwardRef((props: StandardFloatingButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
        <StandardLoadingButton
            variant="contained"
            size="large"
            fullWidth
            disableElevation={false}
            zIndex={WellknownZIndex.FLOATING_BUTTON}
            floating={(props.position === "sticky" ? "sticky" : true)}
            ref={ref}
            loading={props.loading ?? false}
            {...props}
        />
    )
})

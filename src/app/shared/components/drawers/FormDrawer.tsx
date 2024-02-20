import { PropsWithChildren, useEffect, useState } from "react"
import { DialogContentText, Grid } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import Linkify from "react-linkify"
import { Form, useFormikContext } from "formik"
import { ExternalLink } from "../links/ExternalLink"
import { StandardButton } from "../buttons/StandardButton"
import { FormikSubmitButton } from "../forms/Formik"
import { StandardDrawer, StandardDrawerActions, StandardDrawerContent } from "./Drawers"

const useStyles = makeStyles()((theme) => ({
    message: {
        textAlign: "center",
    },
    actionArea: {
        rowGap: theme.spacing(1),
        columnGap: theme.spacing(2),
    },
    actionButton: {
        flexGrow: 1,
    },
}))

type FormikDrawerProps = Readonly<PropsWithChildren<{
    name: string
    title: string
    message?: string
    cancelButtonLabel: string
    submitButtonLabel?: string
    submitButtonLoadingLabel?: string
    open: boolean
    onClose: () => void
    loadingDialog?: JSX.Element
}>>

export function FormikDrawer(props: FormikDrawerProps) {
    const {
        open,
        onClose,
        name,
        title,
        message,
        cancelButtonLabel,
        submitButtonLabel,
        submitButtonLoadingLabel,
        loadingDialog,
        children,
    } = props

    const { classes } = useStyles()
    const [submitted, setSubmitted] = useState(false)
    const { isSubmitting } = useFormikContext()

    useEffect(() => {
        // Reset submitted when open changes to true
        if (open) setSubmitted(false)
    }, [open])

    useEffect(() => {
        // When submitting close drawer and show loading dialog
        if (isSubmitting) {
            setSubmitted(true)
            onClose()
        }
    }, [isSubmitting])

    return (
        <>
            {submitted && loadingDialog}
            <StandardDrawer
                name={name}
                title={title}
                headerVariant="plain"
                open={open}
                onClose={onClose}
                aria-describedby={(message ? `${name}-drawer-message` : undefined)}
            >
                <Form>
                    <StandardDrawerContent dividers={false}>
                        {message && (
                            <DialogContentText id={`${name}-drawer-message`} className={classes.message}>
                                {/* NOTE: Docs are outdated, this is the way to do target: blank with the current API */}
                                <Linkify
                                    componentDecorator={(href, text, key) => (
                                        <ExternalLink key={key} color="primary" href={href}>
                                            {text}
                                        </ExternalLink>
                                    )}
                                >
                                    {message}
                                </Linkify>
                            </DialogContentText>
                        )}
                        {children}
                    </StandardDrawerContent>
                    <StandardDrawerActions>
                        <Grid container direction="row" justifyContent="space-evenly" className={classes.actionArea}>
                            <Grid item className={classes.actionButton}>
                                <StandardButton
                                    variant="outlined"
                                    size="medium"
                                    color="primary"
                                    onClick={onClose}
                                >
                                    {cancelButtonLabel}
                                </StandardButton>
                            </Grid>
                            <Grid item className={classes.actionButton}>
                                <FormikSubmitButton
                                    type="submit"
                                    size="medium"
                                    color="primary"
                                    loadingLabel={submitButtonLoadingLabel}
                                >
                                    {submitButtonLabel}
                                </FormikSubmitButton>
                            </Grid>
                        </Grid>
                    </StandardDrawerActions>
                </Form>
            </StandardDrawer>
        </>
    )
}

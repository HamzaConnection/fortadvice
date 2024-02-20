import React, { Children, FormEventHandler, Fragment, PropsWithChildren, ReactElement, ReactNode } from "react"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { Box, Grid, Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { childrenByElementType } from "../../../../lib/reactLib"
import { Form, Formik, FormikHelpers, FormikValues } from "formik"
import { Schema } from "yup"
import { FormikSubmitButton } from "../../../../shared/components/forms/Formik"
import { PageHeader, PageHeaderProps } from "../../../../shared/components/pageHeader/PageHeader"
import { Page } from "../../../../shared/components/pageHeader/PageHeaderApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { StandardBreadcrumbs } from "../../../../shared/components/links/StandardBreadcrumbs"

const useStyles = makeStyles()((theme) => ({
    container: {
        margin: theme.spacing(4, 0)
    },
    syncText: {
        color: theme.palette.common.black,
        opacity: 0.6,
        fontSize: 12,
        fontWeight: 400,
        lineHeight: 1.6,
        marginTop: theme.spacing(3),
    },
    submitButton: {
        minWidth: "10rem",
    },
    formCard: {
        borderRadius: 12,
        padding: theme.spacing(4),
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#F1F5F9",
        backgroundColor: theme.palette.common.white,
        boxShadow: "0px 2px 6px 0px rgba(0, 0, 0, 0.08)",
        boxSizing: "border-box",
        height: "fit-content",
    },
    formCardMain: {
        flex: "1 1 auto",
        width: "calc(66% - 2rem)",
        minWidth: "15rem",
    },
    formSidePanels: {
        flex: "1 1 auto",
        width: "calc(33% - 2rem)",
        minWidth: "18rem",
        gap: "2rem",
    },
    formTitle: {
        fontSize: 40,
        fontWeight: 600,
        lineHeight: 1.2,
        color: "#475569",
    },
    panelTitle: {
        fontSize: 20,
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "-0.5px",
        color: "#64748B",
        paddingBottom: "2rem",
    },
}))

type BreadcrumbsProps = Readonly<PropsWithChildren<{}>>

export function FormBreadcrumbs({ children }: BreadcrumbsProps) {
    return (
        <StandardBreadcrumbs>
            {children}
        </StandardBreadcrumbs>
    )
}

type FormCardProps = Readonly<PropsWithChildren<{
    className?: string
}>>

function FormCard({ className, children }: FormCardProps) {
    const { classes, cx } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={cx(classes.formCard, className)}>
            {children}
        </Grid>
    )
}

type SidePanelProps = Readonly<PropsWithChildren<{
    title: string
}>>

function FormSidePanel({ title, children }: SidePanelProps) {
    const { classes } = useStyles()

    return (
        <FormCard>
            <Typography variant="h3" className={classes.panelTitle}>
                {title}
            </Typography>

            {children}
        </FormCard>
    )
}

type FormSettingsPanelProps = PropsWithChildren<{}>

export function FormSettingsPanel({ children }: FormSettingsPanelProps) {
    return (
        <LocalizedStrict id="office-manager-settings-panel" attrs={{ title: true }}>
            <FormSidePanel title="Settings">
                {children}
            </FormSidePanel>
        </LocalizedStrict>
    )
}

type FormHistoryPanelProps = PropsWithChildren<{}>

export function FormHistoryPanel({ children }: FormHistoryPanelProps) {
    return (
        <LocalizedStrict id="office-manager-history-panel" attrs={{ title: true }}>
            <FormSidePanel title="History">
                {children}
            </FormSidePanel>
        </LocalizedStrict>
    )
}

type FormSecurityPanelProps = PropsWithChildren<{}>

export function FormSecurityPanel({ children }: FormSecurityPanelProps) {
    return (
        <LocalizedStrict id="office-manager-security-panel" attrs={{ title: true }}>
            <FormSidePanel title="Security">
                {children}
            </FormSidePanel>
        </LocalizedStrict>
    )
}

type FormMainPanelProps = Readonly<PropsWithChildren<{}>>

export function FormMainPanel({ children }: FormMainPanelProps) {
    return (
        <Grid container gap={3} direction="column">
            {Children.map(children, (child, index) => (
                <Grid key={index} item>
                    {child}
                </Grid>
            ))}
        </Grid>
    )
}

type FormWithSidebarLayoutProps<Values extends FormikValues> = Readonly<
    PropsWithChildren<{
        title?: string | ReactElement<PageHeaderProps>
        submitBtnText?: string
        initialValues: Values
        validationSchema: Schema
        onSubmit: (values: Values, helpers: FormikHelpers<Values>) => Promise<void>
    }>
>

export function FormWithSidebarLayout<Values extends FormikValues>({
    title = "",
    submitBtnText = "Submit",
    initialValues,
    validationSchema,
    onSubmit,
    children,
}: FormWithSidebarLayoutProps<Values>) {
    const childGroups = childrenByElementType(children, [])

    const { classes, cx } = useStyles()

    return (
        <Formik<Values>
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            <Form noValidate>
                <Grid container direction="column" gap={3} className={classes.container}>
                    {childGroups.has(FormBreadcrumbs) && childGroups.get(FormBreadcrumbs)?.map((child, index) => (
                        <Fragment key={index}>
                            {child}
                        </Fragment>
                    ))}
                    <Grid item container direction="row" justifyContent="space-between" alignItems="center">
                        <Grid item>
                            {typeof title === "string" && (
                                <Typography variant="h2" className={classes.formTitle}>
                                    {title}
                                </Typography>
                            )}
                            {React.isValidElement(title) && title}
                        </Grid>
                        <Grid item>
                            <FormikSubmitButton fullWidth={false} className={classes.submitButton}>{submitBtnText}</FormikSubmitButton>
                        </Grid>
                    </Grid>

                    <Grid item container direction="row" gap="2rem">
                        <Grid item container direction="column" wrap="nowrap" className={cx(classes.formCard, classes.formCardMain)}>
                            {childGroups.has(FormMainPanel) &&
                                childGroups.get(FormMainPanel)?.map((child, index) => (
                                    <Grid key={index} item sm={12}>
                                        {child}
                                    </Grid>
                                ))}
                        </Grid>

                        <Grid item container direction="column" wrap="nowrap" className={classes.formSidePanels}>
                            {childGroups.has(FormSettingsPanel) && childGroups.get(FormSettingsPanel)?.map((child, index) => (
                                <Grid key={index} item>
                                    {child}
                                </Grid>
                            ))}

                            {childGroups.has(FormSecurityPanel) && childGroups.get(FormSecurityPanel)?.map((child, index) => (
                                <Grid key={index} item>
                                    {child}
                                </Grid>
                            ))}

                            {childGroups.has(FormHistoryPanel) && childGroups.get(FormHistoryPanel)?.map((child, index) => (
                                <Grid key={index} item>
                                    {child}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Form>
        </Formik>
    )
}

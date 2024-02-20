import { useNavigate, useSearchParams } from "react-router-dom"
import { Box, Container, Grid, Typography } from "@mui/material"
import { blue, cyan, indigo } from "@mui/material/colors"
import { makeStyles } from "tss-react/mui"
import { useSnackbar } from "notistack"
import { Form, Formik, FormikHelpers } from "formik"
import * as Yup from "yup"
import { ROOT_ROUTE } from "../../../constants/routes"
import { usePublicApiMutation } from "../../../core/api/useApiMutation"
import { FormikPasswordField, FormikSubmitButton, FormikTextField } from "../../../shared/components/forms/Formik"
import { LanguageSelector } from "../../../shared/components/languageSelector/LanguageSelector"
import { UserType, isAuthenticationComplete } from "../loginTypes"
import { activateAccount, getValidatePwRequest, validatePassword } from "../loginApi"
import { useAppLocalization } from "../../localization/components/AppLocalizationProvider"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import FrontpageLogo from '!file-loader!../assets/gopay-logo-horizontal-white.svg'
import { useState } from "react"
import { useAppDispatch } from "../../store/storeHooks"
import { login } from "../loginSlice"
import { createEnumChecker } from "../../../lib/enums"
import { useDebouncedCallback } from "use-debounce"
import { AppError } from "../../../core/api/errorTypes"
import { safeParseInt } from "../../../lib/lang"

type FormValues = Readonly<{
    username: string
    password: string
    repeatPassword: string
}>

const isUserType = createEnumChecker(UserType)

const useStyles = makeStyles()((theme) => ({
    page: {
        height: "100vh",
        color: theme.palette.common.white,
        backgroundImage: `linear-gradient(${indigo[300]}, ${indigo[600]})`,
        padding: "var(--space-s-m) var(--space-xl-2xl)",

        [theme.breakpoints.down("sm")]: {
            padding: "0.5rem",
            paddingBottom: 0,
        }
    },
    topBar: {
    },
    frontPageLogo: {
        width: "8.625rem",
        height: "auto",

        [theme.breakpoints.down("md")]: {
            width: "6rem"
        },
        [theme.breakpoints.down("sm")]: {
            //visibility: "hidden",
        },
    },
    contentGrid: {
        height: "100%",
        justifyContent: "center",

        [theme.breakpoints.down("sm")]: {
            justifyContent: "flex-end",
        },
    },
    container: {
        padding: "var(--space-s-m)",
        color: theme.palette.common.black,
        backgroundColor: theme.palette.common.white,

        [theme.breakpoints.up("sm")]: {
            paddingLeft: "var(--space-m-l)",
            paddingRight: "var(--space-m-l)",
        },
    },
    outerGrid: {
        height: "100%",
        rowGap: "var(--space-m-l)",
    },
    pageTitle: {
        fontSize: "var(--font-size-step-3)",
        paddingBottom: "var(--space-xs)",
    },
    pageSubtitle: {
        lineHeight: 1.5,
        //paddingBottom: "0.5rem",
    },
    formHeader: {
        fontSize: "var(--font-size-step-1)",
        paddingBottom: "var(--space-s)",
    },
    form: {
        rowGap: "var(--space-xs)",
    },
    ruleBox: {
        width: "100%",
        color: theme.palette.common.white,
        backgroundColor: cyan[700],
        padding: "var(--space-2xs) var(--space-m)",
        "& > ul": {
            listStyleType: "circle",
            margin: 0,
            padding: 0
        }
    },
    submitButton: {
        minWidth: "15rem",
        alignSelf: "flex-end",

        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },
}))

function useInvitationParams() {
    const [searchParams] = useSearchParams()

    const userTypeRaw = searchParams.get("userType")
    const userType = isUserType(userTypeRaw) ? userTypeRaw : undefined

    const companyIdRaw = searchParams.get("companyId")
    const companyId = safeParseInt(companyIdRaw)

    const userGroupIdRaw = searchParams.get("userGroupId")
    const userGroupId = safeParseInt(userGroupIdRaw)

    const oneTimePassword = searchParams.get("otp")
    const defaultUsername = searchParams.get("username")

    let errorMessage = undefined

    if (!userType) {
        errorMessage = `Invitation link was missing valid user type: ${userTypeRaw}`
        throw new AppError("Invalid invitation link", errorMessage)
    }
    if (!companyId) {
        errorMessage = `Invitation link was missing information: companyId`
        throw new AppError("Invalid invitation link", errorMessage)
    }
    if (userType === UserType.OFFICE_MANAGER && !userGroupId) {
        errorMessage = `Invitation link was missing information: userGroupId`
        throw new AppError("Invalid invitation link", errorMessage)
    }
    if (!oneTimePassword) {
        errorMessage = `Invitation link was missing information: otp`
        throw new AppError("Invalid invitation link", errorMessage)
    }

    return {
        userType,
        companyId,
        userGroupId,
        oneTimePassword,
        defaultUsername,
    }
}

type InvitationProps = Readonly<{}>

export function Invitation({}: InvitationProps) {
    const { classes } = useStyles()

    const [pwErrors, setPwErrors] = useState<string[]>([])

    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()

    const { l10n } = useAppLocalization()
    const dispatch = useAppDispatch()

    const { mutateAsync: callValidatePasswordRaw } = usePublicApiMutation(validatePassword, {})
    const { mutateAsync: callActivateAccount } = usePublicApiMutation(activateAccount, {})

    const callValidatePassword = useDebouncedCallback(callValidatePasswordRaw, 200)

    const {
        userType,
        companyId,
        userGroupId,
        oneTimePassword,
        defaultUsername,
    } = useInvitationParams()

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required(l10n.getString("invitation-field-username-required"))
            .min(3, l10n.getString("invitation-field-username-min-chars", { minChars: 3 })),
        password: Yup.string()
            .required(l10n.getString("invitation-field-password-required"))
            .test({
                name: "is-valid",
                test: async (value, _context) => {
                    const request = getValidatePwRequest({ userType, companyId, userGroupId, password: value })
                    const response = await callValidatePasswordRaw(request)
                    if (response && !response.validator.success) {
                        setPwErrors(response.validator.rules)
                        return false
                    } else {
                        setPwErrors([])
                        return true
                    }
                },
                message: l10n.getString("invitation-field-password-invalid-for-policy"),
            }),
//            .min(8, l10n.getString("invitation-field-password-min-chars", { minChars: 8 }))
//            .matches(/\p{Lower}/u, l10n.getString("invitation-field-password-contain-lowercase"))
//            .matches(/\p{Upper}/u, l10n.getString("invitation-field-password-contain-uppercase"))
//            .matches(/[0-9]/, l10n.getString("invitation-field-password-contain-number")),
        repeatPassword: Yup.string()
            .required(l10n.getString("invitation-field-repeatPassword-required"))
            .oneOf([Yup.ref("password")], l10n.getString("invitation-field-repeatPassword-match-password"))
    })

    const userTypeLabel = l10n.getStringForEnum("invitation-usertype", userType ?? "UNKNOWN", "UNKNOWN USER TYPE")

    async function handleSubmit({ username, password }: FormValues, _helpers: FormikHelpers<FormValues>) {
        if (!oneTimePassword) return

        const response = await callActivateAccount({
            username,
            password,
            authentication: {
                type: "ONE_TIME_TOKEN",
                token: oneTimePassword,
            }
        })

        if (isAuthenticationComplete(response)) {
            dispatch(login({
                authToken: response.authentication.token,
                user: response.user,
            }))

            navigate(ROOT_ROUTE)
        } else {
            enqueueSnackbar({
                variant: "error",
                message: `Client expected authentication complete but server said: ${response.authenticationResult.action}`
            })
        }
    }

    return (
        <Grid container direction="column" wrap="nowrap" component="main" className={classes.page}>
            <Grid item container justifyContent="space-between" wrap='nowrap' className={classes.topBar} >
                <img src={FrontpageLogo} className={classes.frontPageLogo} />
                <LanguageSelector color="inherit" />
            </Grid>
            <Grid item container direction="column" wrap="nowrap" className={classes.contentGrid}>
                <Container maxWidth="md" component="section" className={classes.container}>
                    <Grid container direction="column" wrap="nowrap" justifyContent="center" className={classes.outerGrid}>
                        <Grid item>
                            <LocalizedStrict id="invitation-title">
                                <Typography variant="h3" align="center" className={classes.pageTitle}>GoPay Manager invitation</Typography>
                            </LocalizedStrict>
                            <LocalizedStrict id="invitation-subtitle1" vars={{ userType: userTypeLabel }} elems={{ userType: <b></b> }}>
                                <Typography variant="subtitle1" align="center" className={classes.pageSubtitle}>You have been invited to create an account in GoPay Manager as <b>Office Manager</b>.</Typography>
                            </LocalizedStrict>
                            <LocalizedStrict id="invitation-subtitle2">
                                <Typography variant="subtitle1" align="center" className={classes.pageSubtitle}>Please create your new password below.</Typography>
                            </LocalizedStrict>
                        </Grid>

                        <Grid item>
                            <LocalizedStrict id="invitation-form-header">
                                <Typography variant="h5" className={classes.formHeader}>Create your username and password:</Typography>
                            </LocalizedStrict>

                            <Formik<FormValues>
                                initialValues={{ username: defaultUsername ?? "", password: "", repeatPassword: "" }}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                <Form>
                                    <Grid container direction="column" wrap="nowrap" alignItems="flex-start" className={classes.form}>
                                        <LocalizedStrict id="invitation-field-username" attrs={{ label: true }}>
                                            <FormikTextField<FormValues> name="username" label="Username" autoComplete="username" fullWidth />
                                        </LocalizedStrict>
                                        <LocalizedStrict id="invitation-field-password" attrs={{ label: true }}>
                                            <FormikPasswordField<FormValues> name="password" label="Password" fullWidth />
                                        </LocalizedStrict>
                                        <LocalizedStrict id="invitation-field-repeat-password" attrs={{ label: true }}>
                                            <FormikPasswordField<FormValues> name="repeatPassword" label="Repeat password" fullWidth />
                                        </LocalizedStrict>
                                        {pwErrors.length > 0 && (
                                            <Box className={classes.ruleBox}>
                                                <ul>
                                                    {pwErrors.map((message) => (
                                                        <li>{message}</li>
                                                    ))}
                                                    {/*
                                                        <LocalizedStrict id="invitation-username-rules">
                                                            <li>The username must be at least 3 characters long.</li>
                                                        </LocalizedStrict>
                                                        <LocalizedStrict id="invitation-password-rules">
                                                            <li>The password must be at least 8 characters long and contain a lowercase letter, an uppercase letter and a number.</li>
                                                        </LocalizedStrict>
                                                    */}
                                                </ul>
                                            </Box>
                                        )}
                                        <LocalizedStrict id="invitation-submit-button" attrs={{ loadingLabel: true }}>
                                            <FormikSubmitButton fullWidth={false} className={classes.submitButton}>Opret</FormikSubmitButton>
                                        </LocalizedStrict>
                                    </Grid>
                                </Form>
                            </Formik>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    )
}

import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Alert, Box, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import * as yup from 'yup'
import { BackButton } from '../../../shared/components/buttons/BackButton'
import { usePublicApiMutation } from '../../../core/api/useApiMutation'
import { createPassword, getValidatePwRequest, validatePassword } from '../loginApi'
import { StandardButton } from '../../../shared/components/buttons/StandardButton'
import { useNavigate } from 'react-router-dom'
import { ROOT_ROUTE } from '../../../constants/routes'
import { AuthenticationUser, isAuthenticationComplete } from '../loginTypes'
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../localization/components/AppLocalized'
import { useAppDispatch } from '../../store/storeHooks'
import { login } from '../loginSlice'
import { useLocationState } from '../../../core/router/routerHooks'
import { makeStyles } from 'tss-react/mui'
import { cyan } from '@mui/material/colors'

export type CreatePasswordState = Readonly<{
    user: AuthenticationUser | undefined
    oneTimeToken: string
}>

const useStyles = makeStyles()((theme) => ({
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
}))

type FormValues = {
    newPass: string,
    confirmPass: string,
}

export const CreatePassword = () => {
    const { classes } = useStyles()

    const [showPassword, setShowPassword] = useState(false)
    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")
    const [pwErrors, setPwErrors] = useState<string[]>([])

    const { user, oneTimeToken } = useLocationState<CreatePasswordState>({ user: undefined, oneTimeToken: "" })
    const navigate = useNavigate()

    const { l10n } = useAppLocalization()
    const dispatch = useAppDispatch()

    const { mutateAsync: callValidatePassword } = usePublicApiMutation(validatePassword, {})
    const { mutateAsync: callCreatePassword } = usePublicApiMutation(createPassword, {})

    const onSubmit = async ({ newPass, confirmPass }: FormValues, _helpers: FormikHelpers<FormValues>) => {
        if (!oneTimeToken) return

        const response = await callCreatePassword({
            oneTimeToken,
            password: confirmPass,
        })

        if (isAuthenticationComplete(response)) {
            dispatch(login({
                authToken: response.authentication.token,
                user: response.user
            }))

            navigate(ROOT_ROUTE)
        } else {
            setShowErrorToaster(true)
            setErrorMessage(`Client expected authentication complete but server said: ${response.authenticationResult.action}`)
        }
    }

    const initialValues = {
        newPass: '',
        confirmPass: '',
    }

    const validationSchema = yup.object(
        {
            newPass: yup.string()
//                .min(6, l10n.getString("create-password-min-length"))
                .required(l10n.getString("create-password-required"))
                .test({
                    name: "is-pw-valid",
                    test: async (value, _context) => {
                        if (!user) return true
                        const request = getValidatePwRequest({
                            userType: user.userType,
                            companyId: user.companyId,
                            userGroupId: user.userGroupId ?? null,
                            password: value
                        })
                        const response = await callValidatePassword(request)
                        if (response && !response.validator.success) {
                            setPwErrors(response.validator.rules)
                            return false
                        } else {
                            setPwErrors([])
                            return true
                        }
                    },
                    message: l10n.getString("create-password-password-invalid-for-policy"),
                }),
            confirmPass: yup.string()
                .required(l10n.getString("create-password-new-required"))
                .oneOf([yup.ref('newPass')], l10n.getString("create-password-matching"))
//                .min(6, l10n.getString("create-password-min-length"))
            ,
        })


    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>

                {({ errors, touched, isValid }) => (

                    <Box component={Form} sx={{ width: "30rem" }}>
                        <LocalizedStrict id='create-password-title'>
                            <Typography variant='h5' align="left" style={{ marginBottom: '16px' }}>
                                Reset Password
                            </Typography>
                        </LocalizedStrict>



                        <LocalizedStrict id="create-password-new-password-field" attrs={{ label: true }}>
                            <Field
                                as={TextField}
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton></InputAdornment>,
                                }}
                                name="newPass"
                                label="New Password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.newPass && errors.newPass}
                                helperText={touched.newPass && errors.newPass}
                            />
                        </LocalizedStrict>
                        <LocalizedStrict id="create-password-confirm-password-field" attrs={{ label: true }}>
                            <Field
                                as={TextField}
                                type={showPassword ? "text" : "password"}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton></InputAdornment>,
                                }}
                                name="confirmPass"
                                label="Confirm Password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.confirmPass && errors.confirmPass}
                                helperText={touched.confirmPass && errors.confirmPass}
                            />

                        </LocalizedStrict>

                        <LocalizedStrict id="create-password-submit-button">
                            <StandardButton
                                type="submit"
                                fullWidth
                                variant='contained'
                                color="primary"
                                disabled={!isValid}
                                sx={{ marginTop: 3, marginBottom: 2 }}
                            >
                                Reset Password
                            </StandardButton>
                        </LocalizedStrict>
                        <BackButton />

                        {pwErrors.length > 0 && (
                            <Box className={classes.ruleBox}>
                                <ul>
                                    {pwErrors.map((message) => (
                                        <li>{message}</li>
                                    ))}
                                </ul>
                            </Box>
                        )}
                    </Box>
                )
                }
            </Formik >

            <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                    severity="error" variant="filled">{errorMessage}
                </Alert>
            </Snackbar>
        </>


    )
}


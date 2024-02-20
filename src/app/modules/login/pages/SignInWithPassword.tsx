import { Alert, Grid, IconButton, InputAdornment, Link, Snackbar, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';
import { authenticateByPassword } from '../loginApi';
import { Authentication, isAuthenticationComplete } from '../loginTypes';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { FORGOT_PASSWORD_ROUTE, ROOT_ROUTE } from '../../../constants/routes';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { StandardButton } from '../../../shared/components/buttons/StandardButton';
import { usePublicApiMutation } from '../../../core/api/useApiMutation';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { selectUsername } from '../loginSelectors';
import { login } from '../loginSlice';
import { useLocationState } from '../../../core/router/routerHooks';
import { RequiredNonNullProps } from '../../../lib/lang';

type SignInWithPasswordStateLenient = Readonly<{
    authentication: Authentication | undefined
}>

export type SignInWithPasswordState = RequiredNonNullProps<SignInWithPasswordStateLenient>

type FormValues = {
    password: string
}

export const SignInWithPassword = () => {
    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")
    const [showPassword, setShowPassword] = useState(false)

    const { authentication } = useLocationState<SignInWithPasswordStateLenient>({ authentication: undefined })
    const navigate = useNavigate()

    const { l10n } = useAppLocalization()
    const username = useAppSelector(selectUsername)
    const dispatch = useAppDispatch()

    const validationSchema = yup.object({
        password: yup
            .string()
            .required(l10n.getString("sign-in-with-password-required")),
    });

    const initialValues: FormValues = { password: "" }

    const { mutateAsync: callAuthenticateByPassword } = usePublicApiMutation(
        authenticateByPassword, {}
    )

    const onSubmit = async ({ password }: FormValues, _helpers: FormikHelpers<FormValues>) => {
        if (!authentication || !username) return

        const response = await callAuthenticateByPassword({ username, password, authentication })

        if (isAuthenticationComplete(response)) {
            dispatch(login({
                authToken: response.authentication.token,
                user: response.user,
            }))

            navigate(ROOT_ROUTE)

        } else {
            setShowErrorToaster(true)
            setErrorMessage(`Client expected authentication complete but server said: ${response.authenticationResult.action}`)
        }
    }



    return (
        <>
            <Formik<FormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, handleSubmit, isValid }) => (
                    <Box component={Form} onSubmit={handleSubmit} sx={{ width: "30rem" }}>
                        <LocalizedStrict id='sign-in-with-password-title'>
                            <Typography component="h1" variant="h5" align="left">
                                Enter your password
                            </Typography>
                        </LocalizedStrict>
                        <LocalizedStrict id='sign-in-with-password-field-label' attrs={{ label: true }}>
                            <Field
                                as={TextField}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {!showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton></InputAdornment>,
                                }}
                                name="password"
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                                autoComplete="current-password"
                            />
                        </LocalizedStrict>

                        <LocalizedStrict id='sign-in-with-password-submit-button'>
                            <StandardButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ marginTop: 3, marginBottom: 2 }}
                                disabled={!isValid}
                            >
                                Sign In
                            </StandardButton>
                        </LocalizedStrict>
                        <BackButton />

                        <Grid container>

                            <Grid item xs>
                                <Link component={RouterLink} to={FORGOT_PASSWORD_ROUTE} variant="body2">
                                    Forgot password?
                                </Link>

                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Formik>

            <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                    severity="error" variant="filled">{errorMessage}  </Alert>
            </Snackbar>
        </>


    )
}


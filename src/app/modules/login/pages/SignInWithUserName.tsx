import { Alert, Grid, Snackbar, Link, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AUTH_PASSWORD_ROUTE, FORGOT_PASSWORD_ROUTE } from '../../../constants/routes';
import { FormikCheckbox } from '../../../shared/components/Formik/FormikCheckbox';
import { useState } from 'react';
import { StandardButton } from '../../../shared/components/buttons/StandardButton';
import { usePublicApiMutation } from '../../../core/api/useApiMutation';
import { authenticateByUsername } from '../loginApi';
import { isRequiresPasswordResponse } from '../loginTypes';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { useSelector } from 'react-redux';
import { selectRememberMe, selectUsername } from '../loginSelectors';
import { setUsername } from '../loginSlice';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { SignInWithPasswordState } from './SignInWithPassword';

type FormValues = {
    username: string
    rememberUsername: boolean
}

export const SignInWithUserName = () => {
    const username = useAppSelector(selectUsername)
    const rememberMe = useAppSelector(selectRememberMe)
    const dispatch = useAppDispatch()
    const { l10n } = useAppLocalization()

    const validationSchema = yup.object({
        username: yup
            .string()
            .min(3, l10n.getString('sign-in-with-username-min-length'))
            .required(l10n.getString("sign-in-with-username-required")),
        rememberUsername: yup.boolean()
    });

    const initialValues: FormValues = {
        username: username ?? "",
        rememberUsername: rememberMe ?? false
    }


    const { mutateAsync: callAuthenticateByUsername } = usePublicApiMutation(
        authenticateByUsername, {}
    )

    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")



    const navigate = useNavigate();

    const onSubmit = async ({ username, rememberUsername }: FormValues, helpers: FormikHelpers<FormValues>) => {

        const response = await callAuthenticateByUsername({ username })

        if (isRequiresPasswordResponse(response)) {
            dispatch(setUsername({ username, rememberMe: rememberUsername }))
            const navState: SignInWithPasswordState = { authentication: response.authentication }
            navigate(AUTH_PASSWORD_ROUTE, { state: navState })
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
                        <LocalizedStrict id='sign-in-with-username-title'>
                            <Typography component="h1" variant="h5" align="left">
                                Sign in
                            </Typography>
                        </LocalizedStrict>

                        <LocalizedStrict id='sign-in-with-username-field-label' attrs={{ placeholder: true }}>
                            <Field
                                as={TextField}
                                name="username"
                                placeholder="Enter your username"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                                autoComplete="username"


                            />
                        </LocalizedStrict>

                        <LocalizedStrict id='sign-in-with-username-remember-me' >
                            <FormikCheckbox name='rememberUsername' color='primary'>
                                Remember me
                            </FormikCheckbox>
                        </LocalizedStrict>

                        <LocalizedStrict id='sign-in-with-username-submit-button'>
                            <StandardButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ marginTop: 3, marginBottom: 2 }}
                                disabled={!isValid}

                            >
                                Next
                            </StandardButton>
                        </LocalizedStrict>
                        <Grid container>

                            <Grid item xs>
                                <LocalizedStrict id='sign-in-with-username-reset-password-link'>
                                    <Link component={RouterLink} to={FORGOT_PASSWORD_ROUTE} variant="body2">
                                        Forgot password
                                    </Link>
                                </LocalizedStrict>
                            </Grid>

                        </Grid>
                    </Box>
                )}
            </Formik>

            <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                    severity="error" variant="filled">{errorMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

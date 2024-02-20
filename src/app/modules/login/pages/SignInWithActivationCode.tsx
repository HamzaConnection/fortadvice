import { Alert, Snackbar, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import { CREATE_PASSWORD_ROUTE } from '../../../constants/routes';
import { usePublicApiMutation } from '../../../core/api/useApiMutation';
import { authenticateByActivationCode } from '../loginApi';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { StandardButton } from '../../../shared/components/buttons/StandardButton';
import { AuthenticationAction, isRequiresCreatePasswordResponse } from '../loginTypes';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { CreatePasswordState } from './CreatePassword';

type FormValues = {
    activationCode: string
}

export const SignInWithActivationCode = () => {
    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")

    const [searchParams] = useSearchParams()
    const navigate = useNavigate();

    const { l10n } = useAppLocalization()
    const { mutateAsync: callAuthenticateByActivationCode } = usePublicApiMutation(
        authenticateByActivationCode, {}
    )

    const activationCode = searchParams.get("otp") ?? ""

    const validationSchema = yup.object({
        activationCode: yup
            .string()
            .min(6, l10n.getString("sign-in-with-activation-code-min-length"))
            .required(l10n.getString("sign-in-with-activation-code-required")),
    });

    const initialValues: FormValues = { activationCode };

    const onSubmit = async ({ activationCode }: FormValues, _helpers: FormikHelpers<FormValues>) => {
        const response = await callAuthenticateByActivationCode({
            type: "ACTIVATION_CODE",
            value: activationCode
        })

        if (isRequiresCreatePasswordResponse(response)) {
            const navState: CreatePasswordState = {
                user: response.user,
                oneTimeToken: response.authentication.token,
            }
            navigate(CREATE_PASSWORD_ROUTE, { state: navState })
        }
        else {
            setShowErrorToaster(true)
            setErrorMessage(`Client expected ${AuthenticationAction.CREATE_PASSWORD} but server said: ${response.authenticationResult.action}`)
        }
    };

    return (
        <>
            <Formik<FormValues>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ errors, touched, handleSubmit, isValid }) => (
                    <Box component={Form} onSubmit={handleSubmit} sx={{ width: "30rem" }}>
                        <LocalizedStrict id='sign-in-with-activation-code-title'>
                            <Typography component="h1" variant="h5" align="left">
                                Enter your activation code
                            </Typography>
                        </LocalizedStrict>
                        <LocalizedStrict id="sign-in-with-activation-code-field-label" attrs={{ label: true }}>
                            <Field
                                as={TextField}
                                name="activationCode"
                                label="Activation Code"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                error={touched.activationCode && !!errors.activationCode}
                                helperText={touched.activationCode && errors.activationCode}
                            />
                        </LocalizedStrict>
                        <LocalizedStrict id='sign-in-with-activation-code-submit-button'>
                            <StandardButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ marginTop: 3, marginBottom: 2 }}
                                disabled={!isValid}
                            >
                                Submit
                            </StandardButton>
                        </LocalizedStrict>
                        <BackButton />
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

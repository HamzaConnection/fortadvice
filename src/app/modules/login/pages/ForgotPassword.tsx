import { Alert, Box, Snackbar, TextField, Typography } from '@mui/material';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { ACTIVATION_CODE_ROUTE } from '../../../constants/routes';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { BackButton } from '../../../shared/components/buttons/BackButton';
import { usePublicApiMutation } from '../../../core/api/useApiMutation';
import { resetPassword } from '../loginApi';
import { StandardButton } from '../../../shared/components/buttons/StandardButton';
import { isRequiresActivationCodeResponse } from '../loginTypes';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';



export const ForgotPassword = () => {
    const { l10n } = useAppLocalization()

    type FormValues = {
        email: string
    }

    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState("Something went wrong")

    const navigate = useNavigate();

    const onSubmit = async ({ email }: FormValues, helpers: FormikHelpers<FormValues>) => {
        const response = await callResetPassword({ email })
        if (isRequiresActivationCodeResponse(response)) {
            setShowErrorToaster(false)
            navigate(ACTIVATION_CODE_ROUTE)

        } else {
            setShowErrorToaster(true)
            setErrorMessage(`Client expected authentication complete but server said: ${response.authenticationResult.action}`)
        }
    }

    const initialValues = {
        email: '',
    }

    const validationSchema = yup.object({
        // for valid response use
        // test@gopay.menu
        email: yup
            .string()
            .required(l10n.getString('forgot-password-username-required'))
    });

    const { mutateAsync: callResetPassword } = usePublicApiMutation(
        resetPassword, {}
    )



    return (
        <Formik<FormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ errors, touched, handleSubmit, isValid }) => (
                <Box component={Form} onSubmit={handleSubmit} sx={{ width: "30rem" }}>
                    <Typography component="h1" variant="h5" align="left">
                        {l10n.getString("forgot-password-username-title")}
                    </Typography>
                    <LocalizedStrict id="forgot-password-enter-username-field" attrs={{ label: true }}>
                        <Field
                            as={TextField}
                            name="email"
                            label="Enter your username"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={touched.email && !!errors.email}
                            helperText={touched.email && errors.email}
                            autoComplete="email"

                        />
                    </LocalizedStrict>




                    <LocalizedStrict id="forgot-password-button-label">
                        <StandardButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ marginTop: 3, marginBottom: 2 }}
                            disabled={!isValid}
                        >
                            Reset
                        </StandardButton>
                    </LocalizedStrict>
                    <BackButton />


                    <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                        <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                            severity="error" variant="filled">{errorMessage}  </Alert>
                    </Snackbar>
                </Box>
            )}
        </Formik >
    )
}

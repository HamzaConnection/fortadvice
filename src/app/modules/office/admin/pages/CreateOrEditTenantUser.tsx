import { useMemo } from "react"
import { Box, Grid, Typography } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons"
import { makeStyles } from "tss-react/mui"
import { FormikHelpers } from "formik"
import * as Yup from "yup"
import { isPossiblePhoneNumber } from "libphonenumber-js"
import { useLocationState } from "../../../../core/router/routerHooks"
import { FormBreadcrumbs, FormHistoryPanel, FormMainPanel, FormSettingsPanel, FormWithSidebarLayout } from "../components/TenantForm"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { useApiMutation } from "../../../../core/api/useApiMutation"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { FormikSwitch, FormikTextField } from "../../../../shared/components/forms/Formik"
import { User } from "../../../users/userTypes"
import { useAppSelector } from "../../../store/storeHooks"
import { selectUserCompanyId, selectUserGroupId } from "../../../login/loginSelectors"
import { PageHeader } from "../../../../shared/components/pageHeader/PageHeader"
import { Page } from "../../../../shared/components/pageHeader/PageHeaderApi"
import { createUser, updateUser } from "../../../users/userApi"
import { falsyToUndefined } from "../../../../lib/lang"
import { Breadcrumb, BreadcrumbLink, StandardBreadcrumbs } from "../../../../shared/components/links/StandardBreadcrumbs"
import { TENANT_USERS_ROUTE } from "../../../../constants/routes"

export type CreateOrUpdateUserState = {
    user: User | undefined
}

type FormValues = Readonly<{
    username: string
    employeeId: string
    displayName: string
    email: string
    mobileNumber: string
    phoneNumber: string
    sendEmailInvitation: boolean
    ignoreUserSyncJobs: boolean
    isActive: boolean
}>

const useStyles = makeStyles()((theme) => ({
    helperText: {
        color: theme.palette.common.black,
        opacity: 0.6,
        fontSize: 12,
        lineHeight: 1.66,
    },
}))

export function CreateOrEditTenantUser() {
    const { l10n } = useAppLocalization()

    const companyId = useAppSelector(selectUserCompanyId)
    const userGroupId = useAppSelector(selectUserGroupId)

    const { classes } = useStyles()

    const { user } = useLocationState<CreateOrUpdateUserState>({ user: undefined })
    const mode = user ? "update" : "create"

    function getInitialValues(userState?: CreateOrUpdateUserState): FormValues {
        return {
            username: userState?.user?.username ?? "",
            employeeId: userState?.user?.employeeId ?? "",
            displayName: userState?.user?.displayName ?? "",
            email: userState?.user?.email ?? "",
            mobileNumber: userState?.user?.mobileNumber ?? "",
            phoneNumber: userState?.user?.phoneNumber ?? "",
            sendEmailInvitation: true,
            ignoreUserSyncJobs: userState?.user?.settings?.ignoreUserSyncJobs ?? false,
            isActive: userState?.user?.isActive ?? true,
        }
    }

    function getValidationSchema() {
        return Yup.object().shape({
            username: Yup.string(),
            employeeId: Yup.string(),
            displayName: Yup.string()
                .required(l10n.getString("office-manager-create-user-required-field-empty")),
            email: Yup.string()
                .email(l10n.getString("office-manager-create-user-invalid-email-address"))
                .required(l10n.getString("office-manager-create-user-required-field-empty")),
            mobileNumber: Yup.string()
                .test({
                    name: "is-valid-phonenumber",
                    test: (value) => value ? isPossiblePhoneNumber(value, "DK") : true,
                    message: l10n.getString("office-manager-create-user-invalid-phone-number")
                }),
            phoneNumber: Yup.string()
                .test({
                    name: "is-valid-phonenumber",
                    test: (value) => value ? isPossiblePhoneNumber(value, "DK") : true,
                    message: l10n.getString("office-manager-create-user-invalid-phone-number")
                }),
            sendEmailInvitation: Yup.bool(),
            ignoreUserSyncJobs: Yup.bool(),
            isActive: Yup.bool(),
        })
    }

    const initialValues = useMemo(() => getInitialValues({ user }), [user])
    const validationSchema = useMemo(() => getValidationSchema(), [])

    const { mutateAsync: callCreateUser } = useApiMutation(createUser, {})
    const { mutateAsync: callUpdateUser } = useApiMutation(updateUser, {})

    async function handleSubmit(values: FormValues, _helpers: FormikHelpers<FormValues>) {
        console.log(values, companyId, userGroupId)
        if (!companyId || !userGroupId) return

        if (user) {
            await callUpdateUser({
                userId: user.id,
                user: {
                    companyId: user.companyId,
                    customerTypeId: user.customerTypeId,
                    username: user.username,

                    employeeId: values.employeeId,
                    displayName: values.displayName,
                    email: values.email,
                    mobileNumber: values.mobileNumber,
                    phoneNumber: values.phoneNumber,

                    settings: {
                        ignoreUserSyncJobs: values.ignoreUserSyncJobs,
                    },

                    isActive: values.isActive ?? true,
                }
            })
        } else {
            await callCreateUser({
                user: {
                    companyId,
                    customerTypeId: userGroupId,

                    employeeId: falsyToUndefined(values.employeeId),
                    displayName: values.displayName,
                    email: values.email,
                    mobileNumber: falsyToUndefined(values.mobileNumber),
                    phoneNumber: falsyToUndefined(values.phoneNumber),

                    settings: {
                        sendEmailInvitation: values.sendEmailInvitation,
                        ignoreUserSyncJobs: values.ignoreUserSyncJobs,
                    },
                },
            })
        }
    }

    return (
        <LocalizedStrict id={mode === "create" ? "office-manager-create-user-form" : "office-manager-edit-user-form"} attrs={{ submitBtnText: true }}>
            <FormWithSidebarLayout<FormValues>
                title={

                    <PageHeader title={l10n.getString(mode === "create" ? "office-manager-create-user-form-title" : "office-manager-edit-user-form-title")} page={Page.TENANT_CREATE_USER} icon={<FontAwesomeIcon icon={faInfoCircle} />}>
                        {/* {`${!user ? "Create" : "Update"} user`} */}
                    </PageHeader>

                }
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
                submitBtnText={mode === "create" ? "Create" : "Save"}
            >
                <FormBreadcrumbs>
                    <LocalizedStrict id="office-manager-create-user-users-breadcrumb">
                        <BreadcrumbLink to={TENANT_USERS_ROUTE}>Users</BreadcrumbLink>
                    </LocalizedStrict>
                    {user ? (
                        <Breadcrumb>{user.displayName}</Breadcrumb>
                    ) : (
                        <LocalizedStrict id="office-manager-create-user-create-breadcrumb">
                            <Breadcrumb>Create</Breadcrumb>
                        </LocalizedStrict>
                    )}
                </FormBreadcrumbs>
                <FormMainPanel>
                    <LocalizedStrict id="office-manager-create-user-field-id" attrs={{ label: true }}>
                        <FormikTextField<FormValues> name="employeeId" label="Employee ID" fullWidth />
                    </LocalizedStrict>
                    <LocalizedStrict id="office-manager-create-user-field-name" attrs={{ label: true }}>
                        <FormikTextField<FormValues>
                            required
                            name="displayName"
                            label="Name"
                            autoComplete="name"
                            fullWidth
                        />
                    </LocalizedStrict>
                    <LocalizedStrict id="office-manager-create-user-field-email" attrs={{ label: true }}>
                        <FormikTextField<FormValues> required name="email" label="Email" autoComplete="email" fullWidth />
                    </LocalizedStrict>
                    <LocalizedStrict id="office-manager-create-user-field-mobile" attrs={{ label: true }}>
                        <FormikTextField<FormValues> name="mobileNumber" label="Mobile" autoComplete="mobile" fullWidth />
                    </LocalizedStrict>
                    <LocalizedStrict id="office-manager-create-user-field-phone" attrs={{ label: true }}>
                        <FormikTextField<FormValues> name="phoneNumber" label="Phone no." fullWidth />
                    </LocalizedStrict>
                </FormMainPanel>
                <FormSettingsPanel>
                    {mode === "update" && (
                        <LocalizedStrict id="office-manager-create-user-field-active">
                            <FormikSwitch<FormValues> name="isActive">Active</FormikSwitch>
                        </LocalizedStrict>
                    )}
                    <LocalizedStrict id="office-manager-settings-send-invitation">
                        <FormikSwitch<FormValues> name="sendEmailInvitation">Send email invitation</FormikSwitch>
                    </LocalizedStrict>
                    <Box>
                        <LocalizedStrict id="office-manager-settings-disable-sync">
                            <FormikSwitch<FormValues> name="ignoreUserSyncJobs">Disable synchronization</FormikSwitch>
                        </LocalizedStrict>
                        <LocalizedStrict id="office-manager-settings-disable-sync-text">
                            <Typography className={classes.helperText} variant="body2">
                                When disabled this user will be ignored by user synchronization jobs
                            </Typography>
                        </LocalizedStrict>
                    </Box>
                </FormSettingsPanel>
                {user && user?.history !== undefined && (
                    <FormHistoryPanel>
                        <Grid container>
                            <Grid container item>
                                <Grid item xs={12} sm={5} justifyContent="space-between">
                                    <LocalizedStrict id="office-manager-history-created">
                                        <Typography variant="body2">Created:</Typography>
                                    </LocalizedStrict>
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <Typography variant="body2">{`${user?.history?.created}`}</Typography>
                                </Grid>
                            </Grid>
                            <Grid container item>
                                <Grid item xs={12} sm={5}>
                                    <LocalizedStrict id="office-manager-history-edited">
                                        <Typography variant="body2">Edited:</Typography>
                                    </LocalizedStrict>
                                </Grid>
                                <Grid item xs={12} sm={7}>
                                    <Typography variant="body2">{`${user?.history?.created}`}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </FormHistoryPanel>
                )}
            </FormWithSidebarLayout>
        </LocalizedStrict>
    )
}

import { Box, Grid, Typography } from "@mui/material"
import { FormikHelpers } from "formik"
import { useMemo } from "react"
import * as Yup from "yup"
import { makeStyles } from "tss-react/mui"
import { useLocationState } from "../../../../core/router/routerHooks"
import {
    FormBreadcrumbs,
    FormHistoryPanel,
    FormMainPanel,
    FormSecurityPanel,
    FormSettingsPanel,
    FormWithSidebarLayout,
} from "../components/TenantForm"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { useApiMutation } from "../../../../core/api/useApiMutation"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { FormikSwitch, FormikTextField } from "../../../../shared/components/forms/Formik"
import { AdminRole, TenantOfficeManager } from "../../../users/userTypes"
import { useAppSelector } from "../../../store/storeHooks"
import { selectUserCompanyId, selectUserGroupId } from "../../../login/loginSelectors"
import { PageHeader } from "../../../../shared/components/pageHeader/PageHeader"
import { Page } from "../../../../shared/components/pageHeader/PageHeaderApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons"
import { TenantAdminRolesField } from "../components/TenantAdminRolesField"
import { UserType } from "../../../login/loginTypes"
import { isPossiblePhoneNumber } from "libphonenumber-js"
import { createAdmin, updateAdmin } from "../../../users/userApi"
import { falsyToUndefined } from "../../../../lib/lang"
import { Breadcrumb, BreadcrumbLink } from "../../../../shared/components/links/StandardBreadcrumbs"
import { TENANT_USERS_ROUTE } from "../../../../constants/routes"

export type CreateOrUpdateAdminState = {
    user: TenantOfficeManager | undefined
}

type FormValues = Readonly<{
    username: string
    displayName: string
    email: string
    mobileNumber: string
    allowToCreateAdmins: boolean
    restrictAccessToIpAddresses: string
    isActive: boolean
    roles: AdminRole[]
}>

const useStyles = makeStyles()((theme) => ({
    helperText: {
        color: theme.palette.common.black,
        opacity: 0.6,
        fontSize: 12,
        lineHeight: 1.66,
    },
}))
// custom ipv4 validation
// function ipv4(message = "Invalid IP address") {
//     return this.matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
//         message,
//         excludeEmptyString: true,
//     }).test("ip", message, (value) => {
//         return value === undefined || value.trim() === ""
//             ? true
//             : value.split(".").find((i) => parseInt(i, 10) > 255) === undefined
//     })
// }
// Yup.addMethod<Yup.StringSchema>(Yup.string, "ipv4", ipv4)

export function CreateOrEditTenantAdmin() {
    const { l10n } = useAppLocalization()

    const companyId = useAppSelector(selectUserCompanyId)
    const userGroupId = useAppSelector(selectUserGroupId)

    const { classes } = useStyles()

    const { user } = useLocationState<CreateOrUpdateAdminState>({ user: undefined })
    const mode = user ? "update" : "create"

    function getInitialValues(user?: TenantOfficeManager): FormValues {
        return {
            username: user?.user.username ?? "",
            displayName: user?.user?.displayName ?? "",
            email: user?.user?.email ?? "",
            mobileNumber: user?.user?.mobileNumber ?? "",
            allowToCreateAdmins: user?.securitySettings?.allowToCreateAdmins ?? true,
            restrictAccessToIpAddresses: user?.securitySettings?.restrictAccessToIpAddresses ?? "",
            isActive: user?.user.isActive ?? true,
            roles: user?.roles ?? [],
        }
    }

    function getValidationSchema() {
        return Yup.object().shape({
            username: Yup.string(),
            displayName: Yup.string()
                .required(l10n.getString("office-manager-create-user-required-field-empty")),
            email: Yup.string()
                .email(l10n.getString("office-manager-create-user-invalid-email-address"))
                .required(l10n.getString("office-manager-create-user-required-field-empty")),
            mobileNumber: Yup.string()
                .test({
                    name: "is-phone-number",
                    test: (value) => value ? isPossiblePhoneNumber(value, "DK") : true,
                    message: l10n.getString("office-manager-create-user-invalid-phone-number")
                }),
            allowToCreateAdmins: Yup.boolean(),
            restrictAccessToIpAddresses: Yup.string(),
            isActive: Yup.boolean(),
            roles: Yup.array().of(Yup.string()),
        })
    }

    const initialValues = useMemo(() => getInitialValues(user), [user])
    const validationSchema = useMemo(() => getValidationSchema(), [])

    const { mutateAsync: callCreateAdmin } = useApiMutation(createAdmin, {})
    const { mutateAsync: callUpdateAdmin } = useApiMutation(updateAdmin, {})

    async function handleSubmit(values: FormValues, _helpers: FormikHelpers<FormValues>) {
        console.log(values, companyId, userGroupId)
        if (!companyId || !userGroupId) return

        if (user) {
            await callUpdateAdmin({
                userId: user.user.id,
                admin: {
                    type: UserType.OFFICE_MANAGER,
                    user: {
                        username: user.user.username,
                        displayName: values.displayName,
                        email: values.email,
                        mobileNumber: values.mobileNumber,
                        isActive: values.isActive,
                    },
                    officeManagerDetails: user.officeManagerDetails,
                    securitySettings: {
                        allowToCreateAdmins: values.allowToCreateAdmins,
                        restrictAccessToIpAddresses: values.restrictAccessToIpAddresses,
                    },
                    roles: values.roles,
                }
            })
        } else {
            const createdUser = await callCreateAdmin({
                admin: {
                    type: UserType.OFFICE_MANAGER,
                    user: {
                        username: falsyToUndefined(values.username),
                        displayName: values.displayName,
                        email: values.email,
                        mobileNumber: falsyToUndefined(values.mobileNumber),
                    },
                    officeManagerDetails: {
                        companyId,
                        userGroupId,
                    },
                    securitySettings: {
                        allowToCreateAdmins: values.allowToCreateAdmins,
                        restrictAccessToIpAddresses: values.restrictAccessToIpAddresses,
                    },
                    roles: values.roles,
                },
            })
        }
    }

    return (
        <LocalizedStrict id={mode === "create" ? "office-manager-create-user-form" : "office-manager-edit-user-form"} attrs={{ submitBtnText: true }}>
            <FormWithSidebarLayout<FormValues>
                title={

                    <PageHeader title={l10n.getString(mode === "create" ? "office-manager-create-admin-form-title" : "office-manager-edit-admin-form-title")} page={Page.TENANT_CREATE_OFFICE_MANAGER} icon={<FontAwesomeIcon icon={faInfoCircle} />}>
                        {/* {`${!user ? "Create" : "Update"} administrator`} */}
                    </PageHeader>

                }
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                submitBtnText={mode === "create" ? "Create" : "Save"}
            >
                <FormBreadcrumbs>
                    <LocalizedStrict id="office-manager-create-user-users-breadcrumb">
                        <BreadcrumbLink to={TENANT_USERS_ROUTE}>Users</BreadcrumbLink>
                    </LocalizedStrict>
                    {user ? (
                        <Breadcrumb>{user.user.displayName}</Breadcrumb>
                    ) : (
                        <LocalizedStrict id="office-manager-create-user-create-breadcrumb">
                            <Breadcrumb>Create</Breadcrumb>
                        </LocalizedStrict>
                    )}
                </FormBreadcrumbs>
                <FormMainPanel>
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
                    <TenantAdminRolesField name="roles" />
                </FormMainPanel>

                {mode === "update" && (
                    <FormSettingsPanel>
                        <LocalizedStrict id="office-manager-create-user-field-active">
                            <FormikSwitch<FormValues> name="isActive">Active</FormikSwitch>
                        </LocalizedStrict>
                    </FormSettingsPanel>
                )}

                <FormSecurityPanel>
                    <LocalizedStrict id="office-manager-security-manage-admins">
                        <FormikSwitch<FormValues> name="allowToCreateAdmins">Can manage other admins</FormikSwitch>
                    </LocalizedStrict>
                    <Box>
                        <LocalizedStrict id="office-manager-security-ip-field" attrs={{ label: true, helperText: true }}>
                            <FormikTextField<FormValues>
                                name="restrictAccessToIpAddresses"
                                label="Whitelist IP address"
                                helperText="The user will only be allowed to sign in from this IP address"
                                fullWidth
                                // prevent browser from stuffing silly street address components into IP address field
                                autoComplete="off"
                            />
                        </LocalizedStrict>
                    </Box>
                </FormSecurityPanel>

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

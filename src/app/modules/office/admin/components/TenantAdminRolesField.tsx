import { FormikValues } from "formik"
import { StringKeyOf } from "../../../../lib/lang"
import { FormikMultipleAutoComplete } from "../../../../shared/components/forms/Formik"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { AdminRole } from "../../../users/userTypes"

export type AdminRoleOption = Readonly<{
    label: string
    role: AdminRole
}>

type TenantAdminRolesFieldProps<Values extends FormikValues> = Readonly<{
    name: StringKeyOf<Values>
}>

export function TenantAdminRolesField<Values extends FormikValues>({ name }: TenantAdminRolesFieldProps<Values>) {
    const { l10n } = useAppLocalization()

    const options: AdminRoleOption[] = Object.values(AdminRole).map((role) => ({
        label: l10n.getStringForEnum("tenant-admin-role", role, role),
        role: role,
    }))

    return (
        <FormikMultipleAutoComplete<Values, AdminRoleOption, AdminRole>
            name={name}
            label={l10n.getString("tenant-admin-roles-field-label")}
            options={options}
            isOptionEqualToValue={(option, value) => option.role === value}
            areOptionsEqual={(x, y) => x.role === y.role}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.role}
            fullWidth
        />
    )
}

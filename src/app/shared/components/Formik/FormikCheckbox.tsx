import { CheckboxProps, FormControl, FormControlLabel, Checkbox, FormHelperText } from '@mui/material'
import { FormikValues, useField } from 'formik'
import { MouseEvent, PropsWithChildren } from 'react'
import { StrictOmit } from '../../../lib/lang'


export type StringKeyOf<T extends object> = Extract<keyof T, string>

type FormikCheckboxProps<Values extends FormikValues> = Readonly<
    PropsWithChildren<
        StrictOmit<CheckboxProps, "name" | "value" | "checked" | "onChange"> & {
            name: StringKeyOf<Values>
            value?: string | number | readonly string[] // MUI types value prop as unknown but Formik only supports these types
            onLabelClick?: (e: MouseEvent<HTMLLabelElement>) => void
        }
    >
>

// TODO: Replace with FormikCheckbox from file Formik.tsx

export function FormikCheckbox<Values extends FormikValues>({
    name,
    value,
    children,
    onLabelClick,
    ...rest
}: FormikCheckboxProps<Values>) {
    const [field, meta] = useField({ type: "checkbox", name, value })

    return (
        <FormControl error={Boolean(meta.error)}>
            <FormControlLabel
                label={children}
                control={
                    <Checkbox name={name} value={value} checked={field.checked} onChange={field.onChange} {...rest} />
                }
                onClick={onLabelClick}
            />
            <FormHelperText>{meta.error}</FormHelperText>
        </FormControl>
    )
}

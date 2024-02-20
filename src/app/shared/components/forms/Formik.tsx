import { FocusEvent, forwardRef, MouseEvent, PropsWithChildren, ReactNode, Ref, SyntheticEvent, useCallback, useMemo, useState } from "react"
import {
    Checkbox,
    CheckboxProps,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    IconButton,
    InputAdornment,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Radio,
    Select,
    SelectChangeEvent,
    SelectProps,
    TextField,
    TextFieldProps,
    Autocomplete,
    AutocompleteProps,
    AutocompleteValue,
    Switch,
} from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { FormikValues, useField, useFormikContext } from "formik"
import { StrictOmit, StringKeyOf } from "../../../lib/lang"
import { StandardLoadingButton, StandardLoadingButtonProps } from "../buttons/LoadingButton"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { RichEditor } from '../editor/RichEditor'

type FormikTextFieldProps<Values extends FormikValues> = Readonly<
    StrictOmit<TextFieldProps, "name" | "value" | "error" | "onBlur" | "onChange"> & {
        name: StringKeyOf<Values> // make name required and constrain it to the values managed by Formik
    }
>

const useStyles = makeStyles()((_theme) => ({
    textInput: {
        minHeight: "4rem",
    },
    switch: {
        width: "100%",
    },
    switchLabel: {
        "&.MuiFormControlLabel-root": {
            margin: 0,
            justifyContent: "space-between"
        }
    }
}))

export function FormikTextField<Values extends FormikValues>({ name, helperText, ...rest }: FormikTextFieldProps<Values>) {
    const { classes } = useStyles()
    const [field, meta] = useField<string>(name)

    return (
        <TextField
            name={name}
            value={field.value}
            error={meta.touched && Boolean(meta.error)}
            helperText={(meta.touched && meta.error) || helperText}
            onBlur={field.onBlur}
            onChange={field.onChange}
            className={classes.textInput}
            {...rest}
        />
    )
}


type FormikRichTextEditorProps<Values extends FormikValues> = Readonly<{
    name: StringKeyOf<Values> // make name required and constrain it to the values managed by Formik
    placeholder?: string
    helperText?: string
    onCharacterCountChange: (count: number) => void
}
>

export function FormikRichTextEditor<Values extends FormikValues>({ name, placeholder = "", helperText, onCharacterCountChange, ...rest }: FormikRichTextEditorProps<Values>) {
    const { classes } = useStyles()
    const [field, meta] = useField<string>(name)
    const handleChange = useCallback((value: string) => {
        const handler = field.onChange(name)
        handler(value)
    }, [field, name])

    return (
        <FormControl
            error={Boolean(meta.error)}
            fullWidth
        >
            <RichEditor
                placeholder={placeholder}
                value={field.value}
                onBlur={field.onBlur}
                onChange={handleChange}
                onCharacterCountChange={onCharacterCountChange}
                {...rest}
            />
            <FormHelperText>{meta.error || helperText}</FormHelperText>
        </FormControl>
    )
}




type FormikAutoCompleteProps<Values extends FormikValues, TOptions> = Readonly<
    StrictOmit<AutocompleteProps<TOptions, false, false, false>, "onChange" | "value"> & {
        name: StringKeyOf<Values> // make name required and constrain it to the values managed by Formik,
        label: string
    }
>





export function FormikAutoComplete<Values extends FormikValues, TOption>({ name, label, ...rest }: FormikAutoCompleteProps<Values, TOption>) {
    const { classes } = useStyles()
    const [field, meta, helpers] = useField<TOption | null>(name)

    const handleChange = useCallback((_event: SyntheticEvent<Element, Event>, value: AutocompleteValue<TOption, false, false, false>) => {
        helpers.setValue(value)
    }, [field, name])

    return (
        <Autocomplete
            value={field.value}
            onChange={handleChange}
            {...rest}
            renderInput={(params) => <TextField {...params} label={label} />
            }
        />


    )
}

type FormikMultipleAutoCompleteProps<Values extends FormikValues, TOption, TValue> = Readonly<
    StrictOmit<AutocompleteProps<TOption, true, false, false>, "onChange" | "value" | "renderInput" | "isOptionEqualToValue"> & {
        name: StringKeyOf<Values> // make name required and constrain it to the values managed by Formik,
        label: string
        helperText?: string
        isOptionEqualToValue: (option: TOption, value: TValue) => boolean
        areOptionsEqual: (x: TOption, y: TOption) => boolean
        getOptionValue: (option: TOption) => TValue
    }
>

export function FormikMultipleAutoComplete<Values extends FormikValues, TOption, TValue>(props: FormikMultipleAutoCompleteProps<Values, TOption, TValue>) {
    const { name, label, helperText, multiple, options, isOptionEqualToValue, areOptionsEqual, getOptionValue, ...rest } = props

    const [field, meta, helpers] = useField<TValue[]>({ name, multiple: true })

    const optionValues = useMemo(() => {
        const result: TOption[] = field.value.flatMap((value) => {
            const foundOption = options.find((option) => isOptionEqualToValue(option, value))
            if (foundOption === undefined) return []
            return [foundOption]
        })
        return result
    }, [field.value])

    const handleChange = useCallback((_event: SyntheticEvent<Element, Event>, options: AutocompleteValue<TOption, true, false, false>) => {
        const values = options.map((option) => getOptionValue(option))
        helpers.setValue(values)
    }, [field, name])

    return (
        <Autocomplete
            multiple
            options={options}
            value={optionValues}
            isOptionEqualToValue={areOptionsEqual}
            onBlur={field.onBlur}
            onChange={handleChange}
            {...rest}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}
                    label={label}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={(meta.touched && meta.error) || helperText}
                />
            )}
        />


    )
}



type FormikDropdownProps<Values extends FormikValues> = Readonly<
    StrictOmit<SelectProps, "error" | "value" | "name" | "children"> & {
        name: StringKeyOf<Values> // make name required and constrain it to the values managed by Formik
        children: ReactNode // make children required
        fullWidth?: boolean
    }
>

export function FormikDropdown<Values extends FormikValues>({ name, label, fullWidth, children, onBlur, onChange, ...rest }: FormikDropdownProps<Values>) {
    const { classes } = useStyles()
    const [field, meta] = useField<string>(name)

    const handleBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        field.onBlur(e)
        onBlur?.(e)
    }, [onBlur])

    const handleChange = useCallback((e: SelectChangeEvent<unknown>, child: ReactNode) => {
        field.onChange(e)
        onChange?.(e, child)
    }, [onChange])

    return (
        <FormControl fullWidth={fullWidth}>
            <InputLabel id={name + "_label"}>{label}</InputLabel>
            <Select
                labelId={name + "_label"}
                id={name + "_label"}
                name={name}
                error={meta.touched && Boolean(meta.error)}
                onBlur={handleBlur}
                onChange={handleChange}
                className={classes.textInput}
                label={label}
                {...rest}
            >
                {children}
            </Select>
            <FormHelperText>{meta.error}</FormHelperText>
        </FormControl>)
}

export function FormikPasswordField<Values extends FormikValues>(props: FormikTextFieldProps<Values>) {
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = useCallback(() => setShowPassword(prev => !prev), [setShowPassword])

    return (
        <FormikTextField
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            {...props}
        />
    )
}

type FormikCheckboxProps<Values extends FormikValues> = Readonly<
    PropsWithChildren<
        StrictOmit<CheckboxProps, "name" | "value" | "checked" | "onChange"> & {
            name: StringKeyOf<Values>
            value?: string | number | readonly string[] // MUI types value prop as unknown but Formik only supports these types
            onLabelClick?: (e: MouseEvent<HTMLLabelElement>) => void
        }
    >
>

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

type FormikRadioListItemProps<Values extends FormikValues> = Readonly<
    PropsWithChildren<{
        name: StringKeyOf<Values>
        value: string | number | undefined
    }>
>

export function FormikRadioListItem<Values extends FormikValues>({
    name,
    value,
    children,
}: FormikRadioListItemProps<Values>) {
    const [field, _, helpers] = useField({ type: "radio", name, value })

    return (
        <>
            <ListItem button onClick={() => helpers.setValue(value)}>
                <ListItemText primary={children} />
                <ListItemSecondaryAction>
                    <Radio name={name} value={value} checked={field.checked} onChange={() => helpers.setValue(value)} />
                </ListItemSecondaryAction>
            </ListItem>
            <Divider />
        </>
    )
}

type FormikSubmitButtonProps = StrictOmit<StandardLoadingButtonProps, "disabled" | "loading">

export const FormikSubmitButton = forwardRef(
    ({ children, ...rest }: FormikSubmitButtonProps, ref: Ref<HTMLButtonElement>) => {
        const { isValid, isSubmitting, submitCount } = useFormikContext()

        return (
            <StandardLoadingButton
                ref={ref}
                type="submit"
                disabled={!isValid && submitCount > 0}
                loading={isSubmitting}
                {...rest}
            >
                {children}
            </StandardLoadingButton>
        )
    }
)

export function FormikSwitch<Values extends FormikValues>({
    name,
    value,
    children,
    onLabelClick,
    ...rest
}: FormikCheckboxProps<Values>) {
    const [field, meta] = useField({ type: "checkbox", name, value })
    const {classes} = useStyles()
    return (
        <FormControl className={classes.switch} error={Boolean(meta.error)}>
            <FormControlLabel
                className={classes.switchLabel}
                labelPlacement="start"
                label={children}
                control={
                    <Switch name={name} value={value} checked={field.checked} onChange={field.onChange} {...rest} />
                }
                onClick={onLabelClick}
            />
            <FormHelperText>{meta.error}</FormHelperText>
        </FormControl>
    )
}

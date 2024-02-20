import { Autocomplete, AutocompleteProps, Button, ChipTypeMap, CircularProgress, FormControl, FormHelperText, InputLabel, Link, Select, SelectProps, TextField, TextFieldProps } from "@mui/material"
import { StrictOmit } from "../../../lib/lang"
import { LocalizedStrict } from "../../../modules/localization/components/AppLocalized"

export type ApiQueryAutocompleteProps<
    T,
    Multiple extends boolean | undefined,
    DisableClearable extends boolean | undefined,
    FreeSolo extends boolean | undefined,
    ChipComponent extends React.ElementType,
> = StrictOmit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>, "loading" | "loadingText" | "renderInput" | "slotProps"> & Readonly<{
    label?: string
    slotProps?: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>["slotProps"] & Readonly<{
        textField?: Partial<TextFieldProps>
        errorSelect?: Partial<SelectProps>
    }>
    isLoading: boolean
    isError: boolean
    onRetry?: () => void
}>

export function ApiQueryAutocomplete<
    T,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = false,
    ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>({ label, slotProps = {}, isLoading, isError, onRetry, ...rest }: ApiQueryAutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>) {
    const { textField: textFieldProps, errorSelect: errorSelectProps, ...otherSlotProps } = slotProps

    return (
        <>
            {isError && (
                <FormControl error>
                    <InputLabel id="api-query-autocomplete-select-label">{label}</InputLabel>
                    <Select
                        {...errorSelectProps}
                        labelId="api-query-autocomplete-select-label"
                        label={label}
                        readOnly
                    >
                    </Select>
                    <LocalizedStrict
                        id="api-query-autocomplete-fetch-error-message"
                        elems={{ retryLink: onRetry ? <Link sx={{ cursor: "pointer" }} onClick={onRetry}></Link> : <span style={{ display: "none" }}></span> }}
                    >
                        <FormHelperText>Error loading data. <Link>Retry</Link></FormHelperText>
                    </LocalizedStrict>
                </FormControl>
            )}

            {!isError && (
                <LocalizedStrict id="api-query-autocomplete" attrs={{ loadingText: true }}>
                    <Autocomplete<T, Multiple, DisableClearable, FreeSolo, ChipComponent>
                        {...rest}
                        slotProps={otherSlotProps}
                        loading={isLoading}
                        loadingText="Loading data..."
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                {...textFieldProps}
                                label={label ?? textFieldProps?.label}
                                InputProps={{
                                    ...params.InputProps,
                                    ...textFieldProps?.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                            {textFieldProps?.InputProps?.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </LocalizedStrict>
            )}
        </>
    )
}

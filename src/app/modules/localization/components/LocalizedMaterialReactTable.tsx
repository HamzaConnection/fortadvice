import { useMemo } from "react"
import { useSelector } from "react-redux"
import { createTheme, ThemeProvider } from '@mui/material'
import { makeStyles } from 'tss-react/mui';
import MaterialReactTable, { MaterialReactTableProps } from "material-react-table"
import { StrictOmit } from "../../../lib/lang"
import { getMaterialReactTableTranslation } from "../localizationLib"
import { selectSelectedLocale } from "../localizationSelectors"

const useStyles = makeStyles()((_theme) => ({
    font: {
        fontSize: '14px',
    }
}))

export type LocMrtProps<TData extends Record<string, any>> = StrictOmit<MaterialReactTableProps<TData>, "localization">

export function LocalizedMaterialReactTable<TData extends Record<string, any> = {}>(props: LocMrtProps<TData>) {
    const selectedLocale = useSelector(selectSelectedLocale)
    const translation = useMemo(() => getMaterialReactTableTranslation(selectedLocale), [selectedLocale])

    const { classes } = useStyles()

    return (
        <ThemeProvider theme={createTheme({

        })}>
            <MaterialReactTable muiTableBodyProps={{
                sx: {
                    fontSize: '14px',
                },
                className: classes.font,

            }} localization={translation} {...props} />
        </ThemeProvider>
    )
}

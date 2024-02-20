import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { iterateStringEnum } from "../../../../../lib/enums"
import { LocalizedEnum, LocalizedStrict } from "../../../../localization/components/AppLocalized"
import { Period } from '../../../../dashboards/dashboardTypes'

const useStyles = makeStyles()((theme) => ({
    control: {
        minWidth: "12rem",
    },
    select: {
        backgroundColor: theme.palette.common.white,
    },
}))

type SelectPeriodCoreProps = SelectPeriodProps & Readonly<{
    label: string
}>

function SelectPeriodCore({ label, period, onChange }: SelectPeriodCoreProps) {
    const { classes } = useStyles()

    return (
        <FormControl className={classes.control}>
            <InputLabel id="period-picker">{label}</InputLabel>
            <Select
                label={label}
                value={period}
                onChange={onChange}
                className={classes.select}
            >
                {[...iterateStringEnum(Period)].map((period) => (
                    <MenuItem key={period} value={period}>
                        <LocalizedEnum base="survey-period" enumValue={period}>
                            <span>{period}</span>
                        </LocalizedEnum>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

type SelectPeriodProps = Readonly<{
    period: Period
    onChange: (event: SelectChangeEvent<Period>) => void
}>

export function SelectPeriod(props: SelectPeriodProps) {
    return (
        <LocalizedStrict id="survey-period-select" attrs={{ label: true }}>
            <SelectPeriodCore
                label="Period"
                {...props}
            />
        </LocalizedStrict>
    )
}

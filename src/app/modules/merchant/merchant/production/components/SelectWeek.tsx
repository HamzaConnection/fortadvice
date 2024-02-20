
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

import { Box } from '@mui/system';
import { makeStyles } from "tss-react/mui"
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { DateTime, Interval } from 'luxon';
import { useDateTime } from '../../../../localization/useDateTime';




type SelectWeekProps = Readonly<{
    className?: string,
    variant?: 'standard' | 'outlined' | 'filled';
    setStartDate: React.Dispatch<React.SetStateAction<string>>
    startDate: string
    setEndDate: React.Dispatch<React.SetStateAction<string>>

}>


const useStyles = makeStyles()((_theme) => ({
    box: {
        width: "auto"
    }
}))

export function SelectWeek({ className, variant, startDate, setStartDate, setEndDate }: SelectWeekProps) {
    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()

    const handleWeekChange = (event: SelectChangeEvent) => {
        const dateStr = event.target.value
        setStartDate(dateStr)
        setEndDate(DateTime.fromISO(dateStr).endOf("week").toISODate())
    };

    function getStartAndEndDate(): Interval {
        const now = DateTime.now()
        const monday = now.startOf("week")
        const start = monday.minus({ weeks: 4 })
        const end = monday.plus({ weeks: 16 })

        return Interval.fromDateTimes(start, end)
    }

    function* generateWeeks(interval: Interval) {
        let current = interval.start
        do {
            const week = Interval.fromDateTimes(current, current.plus({ days: 6 }))
            yield week
            current = current.plus({ weeks: 1 })
        } while (current < interval.end)
    }

    function CreateMenuItem(week: Interval) {
        const weekNumber = week.start.weekNumber

        return (
            <MenuItem value={week.start.toISODate()}> {l10n.getString("select-week-week")} {weekNumber} ({week.start.toFormat("d/M") + " - " + week.end.toFormat("d/M yyyy")} )</MenuItem>
        )
    }


    const totalPeriod = getStartAndEndDate()
    const weeks = [...generateWeeks(totalPeriod)]

    return (

        <Box className={cx(className, classes.box)} sx={{ backgroundColor: "white" }}>
            <FormControl sx={{ width: 300 }} variant={variant}>


                <InputLabel id="week-selector-label">{l10n.getString("select-week")}</InputLabel>
                <Select
                    value={startDate}
                    onChange={handleWeekChange}
                    label={l10n.getString("select-week")}

                >
                    {weeks.map((weekNumb) => {
                        return CreateMenuItem(weekNumb)
                    })}
                </Select>
            </FormControl>
        </Box>
    );
};

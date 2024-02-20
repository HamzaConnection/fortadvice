import { renderTimeViewClock, TimePicker } from '@mui/x-date-pickers'
import { TimeValidationProps } from '@mui/x-date-pickers/internals'
import { DateTime } from 'luxon'
import { makeStyles } from 'tss-react/mui'
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider'


type StandardTimePickerProps = {
    dateTime: DateTime
    setDateTime: (value: React.SetStateAction<DateTime>) => void
    label: string,
    minTime?: DateTime | undefined
}

export function StandardTimePicker({ label, dateTime, setDateTime, minTime }: StandardTimePickerProps) {

    const useStyles = makeStyles()((theme) => ({

        timeFilter: {
            width: "auto",
            maxWidth: "8rem",

        },
        timePickerIconButton: {
            "& .MuiSvgIcon-root": {
                fontSize: "1.3rem"
            }
        }
    }))


    const { classes } = useStyles()

    return (
        <TimePicker
            minTime={minTime}
            label={label}
            viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
            }}
            minutesStep={5}
            value={dateTime}
            onChange={(newValue) => {
                if (newValue) {
                    setDateTime(newValue)
                }
            }}
            slotProps={{ textField: { variant: "standard", size: "small" }, openPickerButton: { className: classes.timePickerIconButton } }}
            className={classes.timeFilter}
        />
    )
}

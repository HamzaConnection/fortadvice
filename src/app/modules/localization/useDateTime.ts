import { DateTime, Duration } from 'luxon'
import { useAppSelector } from '../store/storeHooks'
import { selectSelectedLocale } from './localizationSelectors'
import { useAppLocalization } from './components/AppLocalizationProvider'

const ISO_TIME_MINUTE_FORMAT = 'HH:mm'
const API_DATETIME_FORMAT = "yyyy-MM-dd HH:mm"
const ISO_DATETIME_MINUTE_FORMAT = "yyyy-MM-dd'T'HH:mm"

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

interface DateTimeFactoryArguments {
    locale: string
    dateFormat: string
    dayAndDateFormat: string
    timeFormat: string
    timeFormatHms: string
    dateTimeFormat: string
    durationHourMinuteFormat: string
    durationMinuteFormat: string
    hourCycle: string
}

type HourCycle = "h11" | "h12" | "h23" | "h24" | undefined

function isHourCycle(value: string | undefined): value is HourCycle {
    switch (value) {
        case "h11":
        case "h12":
        case "h23":
        case "h24":
            return true
        default:
            return false
    }
}


export class DateTimeFactory {
    private locale: string
    private dateFormat: string
    private dayAndDateFormat: string
    private timeFormat: string
    private timeFormatHms: string
    private dateTimeFormat: string
    private durationHourMinuteFormat: string
    private durationMinuteFormat: string
    private hourCycle: HourCycle

    constructor({ locale, dateFormat, dayAndDateFormat, timeFormat, timeFormatHms, dateTimeFormat, durationHourMinuteFormat, durationMinuteFormat, hourCycle }: DateTimeFactoryArguments) {
        this.locale = locale
        this.dateFormat = dateFormat
        this.dayAndDateFormat = dayAndDateFormat
        this.timeFormat = timeFormat
        this.timeFormatHms = timeFormatHms
        this.dateTimeFormat = dateTimeFormat
        this.durationHourMinuteFormat = durationHourMinuteFormat
        this.durationMinuteFormat = durationMinuteFormat
        this.hourCycle = isHourCycle(hourCycle) ? hourCycle : "h12"
    }

    now() {
        return DateTime.local().setLocale(this.locale)
    }

    fromISO(dateTime: string) {
        return DateTime.fromISO(dateTime, { locale: this.locale })
    }

    fromMillis(value: number) {
        return DateTime.fromMillis(value, { locale: this.locale })
    }

    fromApi(dateTime: string) {
        return DateTime.fromSQL(dateTime, { locale: this.locale })
    }

    fromHourMinute(time: string) {
        return DateTime.fromFormat(time, ISO_TIME_MINUTE_FORMAT, { locale: this.locale })
    }

    toApi(dateTime: DateTime) {
        return dateTime.toFormat(API_DATETIME_FORMAT)
    }

    toApiISOMinutesFormat(dateTime: DateTime) {
        return dateTime.toFormat(ISO_DATETIME_MINUTE_FORMAT)
    }

    formatDate(dateTime: DateTime) {
        return dateTime.toFormat(this.dateFormat)
    }

    formatDayAndDate(dateTime: DateTime) {
        return capitalize(dateTime.toFormat(this.dayAndDateFormat))
    }

    formatTime(dateTime: DateTime) {
        return dateTime.toFormat(this.timeFormat)
    }

    formatTimeHms(dateTime: DateTime) {
        return dateTime.toFormat(this.timeFormatHms)
    }

    formatDateTime(dateTime: DateTime) {
        return dateTime.toFormat(this.dateTimeFormat)
    }

    formatDuration(duration: Duration) {
        if (duration.hours > 0) {
            return duration.toFormat(this.durationHourMinuteFormat)
        } else {
            return duration.toFormat(this.durationMinuteFormat)
        }
    }

    formatPeriod(start: DateTime, end: DateTime) {
        if (start.hasSame(end, 'day')) {
            return `${this.formatDate(start)} ${this.formatTime(start)} - ${this.formatTime(end)}`
        } else {
            return `${this.formatDateTime(start)} - ${this.formatDateTime(end)}`
        }
    }

    getHourCycle() {
        return this.hourCycle
    }

    getAmPm = () => {

        const loc = new Intl.DateTimeFormat(this.locale, { hour: "numeric", hourCycle: this.hourCycle })
        return loc.resolvedOptions().hour12 ?? false
    }
}

export function useDateTime() {
    const selectedLocale = useAppSelector(selectSelectedLocale)
    const { l10n } = useAppLocalization()


    // gets translations
    return new DateTimeFactory({
        locale: selectedLocale,
        dateFormat: l10n.getString("date-time-format-date"),
        dayAndDateFormat: l10n.getString("date-time-format-day-and-date"),
        timeFormat: l10n.getString("date-time-format-time"),
        timeFormatHms: l10n.getString("date-time-format-time-hms"),
        dateTimeFormat: l10n.getString("date-time-format-date-and-time"),
        durationHourMinuteFormat: l10n.getString("date-time-format-duration-hours-minutes"),
        durationMinuteFormat: l10n.getString("date-time-format-duration-minutes"),
        hourCycle: l10n.getString("date-time-hour-cycle"),
    })
}

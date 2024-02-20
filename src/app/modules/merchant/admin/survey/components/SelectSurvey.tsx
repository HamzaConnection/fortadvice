import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { SelectProps } from '@mui/material'
import { makeStyles } from "tss-react/mui"
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { ApiQueryAutocomplete } from '../../../../../core/api/components/ApiQueryAutocomplete'
import { Survey } from '../surveyTypes'

function areSurveysEqual(x: Survey, y: Survey) {
    return x.id === y.id
}

function getSurveyName(value: Survey) {
    return value.title
}

const useStyles = makeStyles()((_theme) => ({
    input: {
        width: "20rem",
        backgroundColor: "white"
    }
}))

export type SelectSurveyProps = Readonly<{
    variant?: SelectProps["variant"]
    size?: SelectProps["size"]
    surveys: Survey[] | undefined
    initialSurveyId?: number | null
    survey: Survey | null
    setSurvey: Dispatch<SetStateAction<Survey | null>>
    isLoading: boolean
    isError: boolean
    onRetry: () => void
}>

export function SelectSurvey({ variant, size, surveys, initialSurveyId, survey, setSurvey, isLoading, isError, onRetry }: SelectSurveyProps) {
    const { classes } = useStyles()
    const [input, setInput] = useState<string>("")

    const options = useMemo(() => surveys ?? [], [surveys])

    useEffect(() => {
        setSurvey((prev) => {
            if (!prev) {
                const initial = options.find((s) => s.id === initialSurveyId)
                const active = options.find((s) => s.isActive)

                if (initial) return initial
                if (active) return active
            }

            return prev
        })
        setInput((prev) => {
            if (!prev) {
                const initial = options.find((s) => s.id === initialSurveyId)
                const active = options.find((s) => s.isActive)

                if (initial) return initial.title
                if (active) return active.title
            }

            return prev
        })
    }, [options, initialSurveyId, setSurvey, setInput])

    return (
        <LocalizedStrict id="select-survey" attrs={{ label: true }}>
            <ApiQueryAutocomplete
                label="Survey"
                options={options}
                value={survey}
                onChange={(_e, newValue) => setSurvey(newValue)}
                inputValue={input}
                onInputChange={(_e, newValue, _reason) => setInput(newValue)}
                isOptionEqualToValue={areSurveysEqual}
                getOptionLabel={getSurveyName}
                isLoading={isLoading}
                isError={isError}
                onRetry={onRetry}
                slotProps={{
                    textField: { variant, size, className: classes.input },
                    errorSelect: { variant, size, className: classes.input } }}
            />
        </LocalizedStrict>
    )
}

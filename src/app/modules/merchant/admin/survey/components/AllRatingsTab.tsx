import { Grid } from '@mui/material'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { fetchAllRatings } from '../surveyReportApi'
import { MRT_ColumnDef, MRT_ToggleGlobalFilterButton } from 'material-react-table'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'
import { AllRatingsReport, Survey, TableRatingsReport } from '../surveyTypes'
import { DropdownExportButtonRatings } from './DropdownExportButtonRatings'
import { makeStyles } from "tss-react/mui"
import { displaySmiley } from './SmileySummaryCard'
import { useDateTime } from '../../../../localization/useDateTime'
import { useSurveys } from '../hooks/useSurveys'
import { useApiQueryTable } from '../../../../../core/api/components/ApiQueryTable'

export function transformData(data: AllRatingsReport): TableRatingsReport[] {
    const startDate = data.reportDetails.startDate
    const endDate = data.reportDetails.endDate

    const flattened: TableRatingsReport[] = data.ratings.flatMap((rating) => {
        return rating.survey.questions.map((question) => ({
            startDate,
            endDate,
            ...rating,
            question,
        }))
    })

    return flattened
}

const useStyles = makeStyles()((_theme) => ({
    filters: {
        width: "80%",
        padding: "2rem 1rem",
        gap: "2rem",
    },
    datePicker: {
        width: "9rem",
    },
    textWrap: {
        inlineSize: "8rem",
        overflowWrap: "break-word",
    },
}))

export function AllRatingsTab() {
    const { classes } = useStyles()

    const [survey, setSurvey] = useState<Survey | null>(null)
    const [startDate, setStartDate] = useState<DateTime | null>(DateTime.now().minus({ days: 14 }))
    const [chosenStartDate, setChosenStartDate] = useState<string>(startDate?.toISODate() ?? "")
    const [endDate, setEndDate] = useState<DateTime | null>(DateTime.now())
    const [chosenEndDate, setChosenEndDate] = useState<string>(endDate?.toISODate() ?? "")

    const { l10n } = useAppLocalization()

    const dateTimeFactory = useDateTime()
    const { SelectSurvey } = useSurveys()

    const ratingsResult = useApiQuery(fetchAllRatings, {
        queryName: "survey-all-ratings",
        dependencies: {
            surveyId: survey?.id ?? 0,
            startDate: chosenStartDate,
            endDate: chosenEndDate,
        },
        select: transformData,
        enabled: Boolean(survey?.id) && Boolean(chosenStartDate) && Boolean(chosenEndDate),
    })

    const { ApiQueryTable } = useApiQueryTable<TableRatingsReport>(ratingsResult)

    const columns = useMemo<MRT_ColumnDef<TableRatingsReport>[]>(
        () => [
            {
                header: l10n.getString("all-rating-time"),
                accessorKey: 'created',
                accessorFn(originalRow) {
                    return <p>{dateTimeFactory.formatDateTime(dateTimeFactory.fromISO(originalRow.created))}</p>
                }
            },
            {
                header: l10n.getString("all-rating-question"),
                accessorKey: 'question.title'
            },
            {
                header: l10n.getString("all-rating-topics"),
                accessorFn(originalRow) {
                    return originalRow.question.smiley.topics.map(topic => topic.value).join(", ") ?? ""

                },
                Cell: ({ row }) => {
                    return (
                        <>
                            <p className={classes.textWrap}> {row.original.question.smiley.topics.map(topic => topic.value).join(", ") ?? ""}</p >
                        </>
                    )
                },
            },
            {
                header: l10n.getString("all-rating-score"),
                accessorFn: (originalRow) => (originalRow.question.smiley.value),
                Cell: ({ row }) => {
                    const smiley = row.original.question.smiley.value
                    const src = displaySmiley(smiley)

                    return (
                        <>
                            <img src={src} height={50} />
                        </>
                    )
                },
            },
        ],
        [],
    )

    return (
        <Grid paddingTop="3rem" >
            <ApiQueryTable
                columns={columns}
                enableRowSelection
                enableClickToCopy={false}
                enableColumnOrdering
                enableStickyHeader
                enableDensityToggle={false}
                initialState={{ density: 'spacious' }}
                enableHiding={false}
                enableRowActions
                enableGrouping
                muiTableContainerProps={{ sx: { maxHeight: "100%" } }}
                positionActionsColumn="last"
                enableColumnDragging={false}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: '',
                    },
                }}
                renderToolbarInternalActions={({ table }) => (
                    <>
                        <DropdownExportButtonRatings rowsIsSelected={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()} containsRows={table.getPrePaginationRowModel().rows.length === 0}
                            allRowsWithFilter={table.getPrePaginationRowModel().rows}
                            seletecRows={table.getSelectedRowModel().rows}
                            chosenStartDate={chosenStartDate}
                            chosenEndDate={chosenEndDate}
                        />
                        <MRT_ToggleGlobalFilterButton table={table} />

                    </>
                )}
                renderTopToolbarCustomActions={({ table }) => (
                    <Grid container alignItems="center" className={classes.filters}>
                        <SelectSurvey variant="standard" size="small" survey={survey} setSurvey={setSurvey} />
                        <DatePicker
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            onAccept={(newValue) => setChosenStartDate(newValue?.toISODate() ?? "")}
                            label={l10n.getString("office-start-date")}
                            className={classes.datePicker}
                            slotProps={{ textField: { variant: "standard", size: "small" } }}
                        />
                        <DatePicker
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            onAccept={(newValue) => setChosenEndDate(newValue?.toISODate() ?? "")}
                            label={l10n.getString("office-end-date")}
                            className={classes.datePicker}
                            slotProps={{ textField: { variant: "standard", size: "small" } }}
                        />
                    </Grid>
                )}
            />
        </Grid >
    )
}

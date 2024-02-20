import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { Grid } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { makeStyles } from "tss-react/mui"
import { MRT_ColumnDef, MRT_ToggleGlobalFilterButton } from 'material-react-table'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { useDateTime } from '../../../../localization/useDateTime'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { useApiQueryTable } from '../../../../../core/api/components/ApiQueryTable'
import { Survey, TableRatingsReport } from '../surveyTypes'
import { fetchAllRatings } from '../surveyReportApi'
import { useSurveys } from '../hooks/useSurveys'
import { DropdownExportButtonRatings } from './DropdownExportButtonRatings'
import { displaySmiley } from './SmileySummaryCard'
import { transformData } from './AllRatingsTab'

const useStyles = makeStyles()((_theme) => ({
    filters: {
        width: "80%",
        padding: "2rem 1rem",
        gap: "2rem",
    },
    datePicker: {
        width: "9rem",
    },
}))

export function RatingCommentsTab() {
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

    const { ApiQueryTable } = useApiQueryTable(ratingsResult)

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
                header: l10n.getString("all-rating-score"),
                accessorFn: (originalRow) => (originalRow.question.smiley.value),
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ row }) => {
                    return (
                        <>
                            <img src={displaySmiley(row.original.question.smiley.value)} height={50} />
                        </>
                    )
                },
            },
            {
                header: l10n.getString("all-rating-comment"),
                size: 400,
                accessorFn(originalRow) {
                    return <p> {originalRow.question.smiley.comment}</p>

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
                            sx={{ width: "9rem", marginRight: "2rem", }}
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            onAccept={(newValue) => setChosenStartDate(newValue?.toISODate() ?? "")}
                            label={l10n.getString("office-start-date")}
                            className={classes.datePicker}
                            slotProps={{ textField: { variant: "standard", size: "small" } }} />
                        <DatePicker
                            sx={{ width: "9rem", marginRight: "2rem" }}
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            onAccept={(newValue) => setChosenEndDate(newValue?.toISODate() ?? "")}
                            label={l10n.getString("office-end-date")}
                            className={classes.datePicker}
                            slotProps={{ textField: { variant: "standard", size: "small" } }} />
                    </Grid>
                )}
            />
        </Grid >
    )
}

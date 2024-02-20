import { Fragment, PropsWithChildren, Suspense, useEffect, useState } from 'react'
import { type FallbackProps } from 'react-error-boundary'
import { Box } from '@mui/system'
import { Divider, Grid, SelectChangeEvent, Skeleton, Typography } from '@mui/material'
import { faMessageQuestion } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { makeStyles } from 'tss-react/mui'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { QueryErrorBoundary } from '../../../../../core/api/components/QueryErrorBoundary'
import { SuspenseAdapter } from '../../../../../core/api/components/SuspenseAdapter'
import { Survey } from '../surveyTypes'
import { Period } from '../../../../dashboards/dashboardTypes'
import { useSurveys } from '../hooks/useSurveys'
import { SelectPeriod } from './SelectPeriod'
import { SmileySummaryCard } from './SmileySummaryCard'
import { ParticipationCard } from './ParticipationCard'
import { SmileyDistributionCard } from './SmileyDistributionCard'
import { TopicsDistributionCard } from './TopicsDistributionCard'
import { SatisfactionTrendCard } from './SatisfactionTrendCard'
import { useSearchParams } from 'react-router-dom'
import { createEnumChecker } from '../../../../../lib/enums'
import { safeParseInt } from '../../../../../lib/lang'

const isPeriod = createEnumChecker(Period)

const useStyles = makeStyles()((_theme) => ({
    questionsFallback: {
        height: "30vh",
        width: "100%",
        marginTop: "4rem",
    },
    questionSection: {
        paddingTop: "4rem",
        gap: "2rem",
    },
    questionDivider: {
        marginTop: "2rem",
    },
    titleGrid: {
        gap: "0.75rem",
    },
    titleSkeleton: {
        width: "20rem",
    },
    cardSection: {
        gap: "2rem",
    },
    card:  {
        height: "23rem",
        flex: "1 1",
    },
    doubleCard: {
        height: "23rem",
        flex: "2 1",
    },
}))

type QuestionsMessageProps = Readonly<PropsWithChildren<{}>>

function QuestionsMessage({ children }: QuestionsMessageProps) {
    const { classes } = useStyles()

    return (
        <Grid container justifyContent="center" alignItems="center" className={classes.questionsFallback}>
            <Typography variant="h6" color="text.secondary" fontStyle="italic">
                {children}
            </Typography>
        </Grid>
    )
}

function QuestionsFallback(_props: FallbackProps) {
    return (
        <LocalizedStrict id="survey-tab-ratings-no-survey-data">
            <QuestionsMessage>No data to display</QuestionsMessage>
        </LocalizedStrict>
    )
}

type QuestionSectionProps = Readonly<{
    surveyId: number | undefined
    questionId: number | undefined
    title: string | undefined
    period: Period
}>

function QuestionSection({ surveyId, questionId, title, period }: QuestionSectionProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.questionSection}>
            <Grid container wrap="nowrap" alignItems="center" className={classes.titleGrid}>
                <FontAwesomeIcon icon={faMessageQuestion} size='xl' />
                <Typography variant="h6">
                    {title}
                    {!title && (
                        <Skeleton variant="text" animation="wave" className={classes.titleSkeleton} />
                    )}
                </Typography>
            </Grid>
            <Grid container className={classes.cardSection}>
                {(!surveyId || !questionId) && (
                    <>
                        <Skeleton variant="rounded" animation="wave" className={classes.card} />
                        <Skeleton variant="rounded" animation="wave" className={classes.card} />
                        <Skeleton variant="rounded" animation="wave" className={classes.doubleCard} />
                    </>
                )}
                {(surveyId && questionId) && (
                    <>
                        <SmileySummaryCard
                            surveyId={surveyId}
                            questionId={questionId}
                            period={period}
                            slotProps={{ card: { className: classes.card } }}
                        />
                        <ParticipationCard
                            surveyId={surveyId}
                            questionId={questionId}
                            period={period}
                            slotProps={{ card: { className: classes.card } }}
                        />
                        <SmileyDistributionCard
                            surveyId={surveyId}
                            questionId={questionId}
                            period={period}
                            slotProps={{ card: { className: classes.doubleCard } }}
                        />
                    </>
                )}
            </Grid>
            <Grid container className={classes.cardSection}>
                {(!surveyId || !questionId) && (
                    <>
                        <Skeleton variant="rounded" animation="wave" className={classes.card} />
                        <Skeleton variant="rounded" animation="wave" className={classes.card} />
                    </>
                )}
                {(surveyId && questionId) && (
                    <>
                        <LocalizedStrict id="survey-tab-ratings-good-topics-card" attrs={{ title: true, datasetLabel: true }}>
                            <TopicsDistributionCard
                                topicType="good"
                                title="Satisfied with"
                                datasetLabel="Votes"
                                surveyId={surveyId}
                                questionId={questionId}
                                period={period}
                                slotProps={{ card: { className: classes.card } }}
                            />
                        </LocalizedStrict>
                        <LocalizedStrict id="survey-tab-ratings-bad-topics-card" attrs={{ title: true, datasetLabel: true }}>
                            <TopicsDistributionCard
                                topicType="bad"
                                title="Dissatisfied with"
                                datasetLabel="Votes"
                                surveyId={surveyId}
                                questionId={questionId}
                                period={period}
                                slotProps={{ card: { className: classes.card } }}
                            />
                        </LocalizedStrict>
                    </>
                )}
            </Grid>
            <Grid container justifyContent="stretch">
                {(!surveyId || !questionId) && (
                    <Skeleton variant="rounded" animation="wave" className={classes.card} />
                )}
                {(surveyId && questionId) && (
                    <LocalizedStrict id="survey-tab-overview-trend-card" attrs={{ title: true, scoreLabel: true, votesLabel: true }}>
                        <SatisfactionTrendCard
                            title="Satisfaction trend"
                            scoreLabel="Average score"
                            votesLabel="Number of ratings"
                            surveyId={surveyId}
                            questionId={questionId}
                            period={period}
                            slotProps={{ card: { className: classes.card } }}
                        />
                    </LocalizedStrict>
                )}
            </Grid>
            <Divider className={classes.questionDivider} />
        </Grid>
    )
}

function safeParsePeriod(value: string | null) {
    if (value === null) return null
    return isPeriod(value) ? value : null
}

export function RatingsOverviewTab() {
    const [searchParams, setSearchParams] = useSearchParams()

    const [surveyId] = useState<number | null>(safeParseInt(searchParams.get("surveyId")))
    const [survey, setSurvey] = useState<Survey | null>(null)
    const [period, setPeriod] = useState<Period>(safeParsePeriod(searchParams.get("period")) ?? Period.LAST_WEEK)

    const { surveysResult, SelectSurvey } = useSurveys(surveyId)

    const handlePeriodChange = (event: SelectChangeEvent<Period>) => {
        const selectedPeriod = event.target.value
        setPeriod(selectedPeriod as Period)
    }

    useEffect(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            if (survey) next.set("surveyId", `${survey.id}`)
            else next.delete("surveyId")
            return next
        })
    }, [survey])

    useEffect(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev)
            next.set("period", period)
            return next
        })
    }, [period])

    return (
        <>
            <Box sx={{ display: "flex", gap: "2rem" }}>
                <SelectSurvey survey={survey} setSurvey={setSurvey} />
                <SelectPeriod period={period} onChange={handlePeriodChange} />
            </Box >

            <QueryErrorBoundary Fallback={QuestionsFallback}>
                <Suspense fallback={<QuestionSection surveyId={undefined} questionId={undefined} title={undefined} period={period} />}>
                    <SuspenseAdapter data={surveysResult.data} error={surveysResult.error} isLoading={surveysResult.isInitialLoading}>
                        {surveysResult.data && surveysResult.data.surveys.length === 0 && (
                            <LocalizedStrict id="survey-tab-overview-no-surveys">
                                <QuestionsMessage>No surveys defined yet.</QuestionsMessage>
                            </LocalizedStrict>
                        )}
                        {survey && !survey.questions && (
                            <LocalizedStrict id="survey-tab-overview-no-questions">
                                <QuestionsMessage>No questions defined for this survey.</QuestionsMessage>
                            </LocalizedStrict>
                        )}
                        {survey && survey.questions && survey.questions.map((question) => {
                            return (
                                <Fragment key={question.id}>
                                    <QuestionSection surveyId={survey.id} questionId={question.id} title={question.title} period={period} />
                                    <Divider />
                                </Fragment>
                            )
                        })}
                    </SuspenseAdapter>
                </Suspense>
            </QueryErrorBoundary>
        </>
    )
}

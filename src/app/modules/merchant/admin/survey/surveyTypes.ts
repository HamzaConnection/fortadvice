import { ReportDetails } from '../../controlKitchenApi'


type SmileyTopic = Readonly<{
    id: number
    value: string
}>

type SmileyRating = Readonly<{
    value: string
    topics: SmileyTopic[]
    comment?: string
}>

type RatingQuestion = Readonly<{
    id: number
    title: string
    smiley: SmileyRating
}>

type RatingSurvey = Readonly<{
    type: string
    id: number
    title: string
    questions: RatingQuestion[]
}>

type Rating = Readonly<{
    id: number
    created: string
    survey: RatingSurvey
}>

export type AllRatingsReport = Readonly<{
    reportDetails: ReportDetails
    ratings: Rating[]
}>


export type TableRatingsReport = Rating & Readonly<{
    question: RatingQuestion,
    startDate: string
    endDate: string
}>




type VisiblePeriod = Readonly<{
    from: {
        time: string
        date: string
    }
    to: {
        time: string
        date: string
    }
}>

type SurveyQuestion = Readonly<{
    id: number
    title: string
}>

export type Survey = Readonly<{
    id: number
    description: string
    title: string
    isActive: boolean
    type: string
    visibleForProductsIds: number[]
    hideAfterDays: number
    visiblePeriod: VisiblePeriod
    questions: SurveyQuestion[]
}>





export type TopicVotes = Readonly<{
    topic: string
    numberOfRatings: number
}>

type TopicQuestion = Readonly<{
    id: number
    goodTopics: TopicVotes[]
    badTopics: TopicVotes[]
}>

export type TopicVoteDistribution = Readonly<{
    reportDetails: ReportDetails
    questions: TopicQuestion[]
}>




export enum SmilyValueTypes {
    BAD = "BAD",
    POOR = "POOR",
    MEDIUM = "MEDIUM",
    GOOD = "GOOD",
    EXCELLENT = "EXCELLENT"
}



export type SmileyRatingSummary = Readonly<{
    averageScore: number
    value: SmilyValueTypes
    numberOfRatings: number
    numberOfOrders: number
    participationPercentage: number
}>

export type SmileyVotes = Readonly<{
    label: SmilyValueTypes
    value: number
    numberOfRatings: number
}>



type SmileyQuestion = Readonly<{
    id: number
    ratingsSummary: SmileyRatingSummary
    smileysSummaries: SmileyVotes[]
}>

export type SmileySummaryReport = Readonly<{
    reportDetails: ReportDetails
    reportSummary: SmileyRatingSummary
    questions: SmileyQuestion[]
}>



type DailyReportSummary = Readonly<{
    averageScore: number
    numberOfRatings: number
}>

type DayRatingSummary = Readonly<{
    date: string
    numberOfRatings: number
    averageScore: number
}>

type DailyRatingsQuestion = Readonly<{
    id: number
    ratingsSummaries: DayRatingSummary[]
}>

export type DailyRatings = Readonly<{
    reportDetails: ReportDetails
    reportSummary: DailyReportSummary
    questions: DailyRatingsQuestion[]
}>

export type SurveySummary = Readonly<{
    id: number
    name?: string
    title?: string
    ratingsSummary: SmileyRatingSummary
}>

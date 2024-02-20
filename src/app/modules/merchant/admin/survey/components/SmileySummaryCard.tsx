import { Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { createEnumChecker } from '../../../../../lib/enums'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { type DashboardCardProps } from '../../../../dashboards/components/DashboardCard'
import { DashboardDataCard, DashboardDataContents, DashboardDataLegend } from '../../../../dashboards/components/DashboardDataCard'
import { type SmileyRatingSummary, SmilyValueTypes } from '../surveyTypes'
import { Period } from '../../../../dashboards/dashboardTypes'
import { type UseSmileySummary, useSmileySummary } from '../hooks/useSmileySummary'
import VeryBadSmily from '!file-loader!../assets/smiley-rating-very-bad.svg'
import PoorSmily from '../assets/smiley-rating-poor.svg'
import MediumSmily from '../assets/smiley-rating-medium.svg'
import GoodSmily from '../assets/smiley-rating-good.svg'
import ExcellentSmily from '../assets/smiley-rating-excellent.svg'
import { useNumber } from '../../../../localization/useNumber'
import { useNavigate } from 'react-router-dom'
import { SURVEY_ROUTE } from '../../../../../constants/routes'

const isSmileyValue = createEnumChecker(SmilyValueTypes)

export const displaySmiley = (smileyLabel: string) => {
    const rawValue = smileyLabel.toUpperCase()
    const value = isSmileyValue(rawValue) ? rawValue : undefined

    switch (value) {
        case SmilyValueTypes.BAD:
            return VeryBadSmily
        case SmilyValueTypes.POOR:
            return PoorSmily
        case SmilyValueTypes.MEDIUM:
            return MediumSmily
        case SmilyValueTypes.GOOD:
            return GoodSmily
        case SmilyValueTypes.EXCELLENT:
            return ExcellentSmily
        default:
            return ""
    }

}

const useStyles = makeStyles()((_theme) => ({
    graphWrapper: {
        height: "auto",
    },
    image: {
        height: "9rem",
    },
    imageSmallCard: {
        height: "7rem",
    },
}))

type ContentProps = Readonly<{
    smileySummary: SmileyRatingSummary
    imageProps: {
        className: string
    }
}>

function SmileyContent({ smileySummary, imageProps }: ContentProps) {
    return (
        <img
            src={displaySmiley(smileySummary.value)}
            className={imageProps.className}
        />
    )
}

type LegendProps = Pick<ContentProps, "smileySummary">

function SmileyLegend({ smileySummary }: LegendProps) {
    const numberFactory = useNumber({})
    const averageScore = numberFactory.formatToDecimal(smileySummary.averageScore, 1)

    return (
        <LocalizedStrict
            id="survey-smiley-summary-card-overall-score-label"
            vars={{ averageScore }}
        >
            <Typography variant="h6" sx={{ color: "#555555" }}>
                {`Score: ${averageScore}`}
            </Typography>
        </LocalizedStrict>
    )
}

type ContentLoaderProps = UseSmileySummary & Pick<ContentProps, "imageProps">

function ContentLoader({ imageProps, ...rest }: ContentLoaderProps) {
    const data = useSmileySummary(rest)

    return (
        <SmileyContent smileySummary={data.ratingsSummary} imageProps={imageProps} />
    )
}

function LegendLoader(props: UseSmileySummary) {
    const data = useSmileySummary(props)

    return (
        <SmileyLegend smileySummary={data.ratingsSummary} />
    )
}

type CardProps = UseSmileySummary & Readonly<{
    slotProps?: DashboardCardProps["slotProps"] & Readonly<{
        image?: ContentProps["imageProps"]
    }>
}>

export function SmileySummaryCard({ slotProps = {}, ...rest }: CardProps) {
    const { image: imageProps, ...otherSlotProps } = slotProps
    const { classes, cx } = useStyles()

    return (
        <LocalizedStrict id="survey-smiley-summary-card" attrs={{ title: true }}>
            <DashboardDataCard
                title="Overall score"
                dependencies={rest}
                slotProps={{
                    ...otherSlotProps,
                    contentWrapper: { justifyContent: "center" }
                }}
            >
                <DashboardDataContents>
                    <ContentLoader
                        imageProps={{ ...imageProps, className: cx(classes.image, imageProps?.className) }}
                        {...rest}
                    />
                </DashboardDataContents>
                <DashboardDataLegend>
                    <LegendLoader {...rest} />
                </DashboardDataLegend>
            </DashboardDataCard>
        </LocalizedStrict>
    )
}

type ExtCardProps = Readonly<{
    title: string
    surveyId: number
    smileySummary: SmileyRatingSummary
    slotProps?: DashboardCardProps["slotProps"] & Readonly<{
        image?: ContentProps["imageProps"]
    }>
}>

export function SmileyExtSummaryCard({ title, surveyId, smileySummary, slotProps = {} }: ExtCardProps) {
    const { image: imageProps, ...otherSlotProps } = slotProps
    const { classes, cx } = useStyles()
    const navigate = useNavigate()

    function handleClick() {
        const url = `${SURVEY_ROUTE}?surveyId=${surveyId}&period=${Period.LAST_MONTH}`
        navigate(url)
    }

    return (
        <DashboardDataCard
            title={title}
            onClick={handleClick}
            slotProps={{
                ...otherSlotProps,
                contentWrapper: { justifyContent: "center" },
                graphWrapper: { className: classes.graphWrapper }
            }}
        >
            <DashboardDataContents>
                <SmileyContent
                    smileySummary={smileySummary}
                    imageProps={{ ...imageProps, className: cx(classes.imageSmallCard, imageProps?.className)}} />
            </DashboardDataContents>
            <DashboardDataLegend>
                <SmileyLegend smileySummary={smileySummary} />
            </DashboardDataLegend>
        </DashboardDataCard>
    )
}

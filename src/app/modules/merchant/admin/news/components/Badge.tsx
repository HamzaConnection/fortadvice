import { Chip } from '@mui/material'
import { makeStyles } from 'tss-react/mui';
import { grey } from '@mui/material/colors';
import { MerchantArticleStatus } from '../merchantNewsItemType';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';


type BadgeProps = Readonly<{
    articleStatus?: MerchantArticleStatus
    className?: string
}>

export const Badge = ({ articleStatus, className }: BadgeProps) => {
    const { l10n } = useAppLocalization()


    const useStyles = makeStyles()((theme) => ({


    }))

    const { classes, cx } = useStyles()

    if (articleStatus) {
        if (articleStatus === MerchantArticleStatus.DRAFT) {
            return (
                <LocalizedStrict id="news-draft-type" >
                    <Chip color="error" label={l10n.getString("news-draft-type")} className={cx(className)} />
                </LocalizedStrict >
            )

        } else if (articleStatus === MerchantArticleStatus.PUBLISHED) {
            return (
                <LocalizedStrict id="news-published-type" >
                    <Chip color="success" label={l10n.getString("news-published-type")} className={cx(className)} />
                </LocalizedStrict>
            )
        }
        else if (articleStatus === MerchantArticleStatus.SCHEDULED) {
            return (
                <Chip color="warning" label={l10n.getString("news-schedule-type")} className={cx(className)} />
            )
        }

        else if (articleStatus === MerchantArticleStatus.EXPIRED) {
            return (
                <Chip label={l10n.getString("news-expired-type")} className={cx(className)} />

            )
        }
    }

    return ""


}

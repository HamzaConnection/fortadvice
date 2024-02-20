import { Typography } from '@mui/material'
import { grey } from '@mui/material/colors';
import { Box } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { MerchantArticleStatus } from '../merchantNewsItemType';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';




type ArticleSettingsPanelProps = Readonly<{
    publishDate: DateTime | undefined
    setPublishDate: React.Dispatch<React.SetStateAction<DateTime | undefined>>
    expiryDate: DateTime | undefined
    setExpiryDate: React.Dispatch<React.SetStateAction<DateTime | undefined>>
    articleStatus: MerchantArticleStatus
}>

export function ArticleSettingsPanel({ publishDate, setPublishDate, expiryDate, setExpiryDate, articleStatus }: ArticleSettingsPanelProps) {
    const { l10n } = useAppLocalization()

    return (
        <>
            <LocalizedStrict id="article-settings-panel-settings-title" >
                <Typography fontWeight="bold" sx={{ marginTop: "2.8rem", marginBottom: "1rem" }}>Settings</Typography>
            </LocalizedStrict>

            <Box sx={{ paddingX: "1.5rem", paddingY: "2rem", backgroundColor: grey[50], borderRadius: ".5rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }} >
                <DatePicker
                    sx={{ width: "10rem", marginBottom: "1rem" }}
                    value={publishDate}
                    onChange={(newValue) => {
                        if (newValue) {
                            setPublishDate(newValue)
                        }
                    }}
                    label={articleStatus === MerchantArticleStatus.PUBLISHED ? l10n.getString("article-settings-panel-published") : l10n.getString("article-settings-panel-schedule-for")}
                    slotProps={{ textField: { variant: "standard", size: "small" } }}
                />

                <DatePicker
                    sx={{ width: "10rem", marginBottom: "1rem" }}
                    value={expiryDate}
                    onChange={(newValue) => {
                        if (newValue) {
                            setExpiryDate(newValue)
                        }
                    }}
                    label={l10n.getString("article-settings-panel-expires")}
                    slotProps={{ textField: { variant: "standard", size: "small" } }}
                />
            </Box>
        </>
    )
}

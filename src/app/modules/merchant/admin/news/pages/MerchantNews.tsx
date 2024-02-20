import { Box } from '@mui/system';
import { Tab, Tabs, Typography } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { MerchantNewsTab } from './MerchantNewsTab';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeStyles } from 'tss-react/mui'
import { MerchantArchiveNewsTab } from './MerchantArchiveTab';
import { useNavigate } from 'react-router-dom';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { TabPanel } from '../../../../../shared/components/tabs/tabPanel';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { MERCHANT_CREATE_NEWS_ROUTE } from '../../../../../constants/routes';

export function MerchantNews() {

    const navigate = useNavigate()

    const [value, setValue] = useState(0);
    const { l10n } = useAppLocalization()


    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const useStyles = makeStyles()((theme) => ({
        floatingButton: {
            position: "fixed",
            bottom: "50px",
            right: "50px",
            [theme.breakpoints.down("sm")]: {
                bottom: "25px",
                right: "25px",
            },
        }
    }))



    const { classes } = useStyles()

    return (
        <Box sx={{ width: '100%', pt: '1rem' }}>
            <LocalizedStrict id='news-header'>
                <Typography variant="h6" gutterBottom sx={{ marginY: "1.5rem", marginLeft: "1.5rem", }}>
                    My News
                </Typography>
            </LocalizedStrict>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab value={0} label={l10n.getString("news-current-news")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={1} label={l10n.getString("news-archive-news")} wrapped sx={{ textTransform: 'none' }} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <MerchantNewsTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <MerchantArchiveNewsTab />
            </TabPanel>
            <LocalizedStrict id="news-create-new-button">
                <StandardButton size='medium' fullWidth={false} className={classes.floatingButton} startIcon={<FontAwesomeIcon icon={faCirclePlus} />
                } color="black" onClick={() => navigate(MERCHANT_CREATE_NEWS_ROUTE)}>Create new</StandardButton>
            </LocalizedStrict>
        </Box >
    )
}

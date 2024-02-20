import { Tab, Tabs } from '@mui/material'
import { Box } from '@mui/system'
import { SyntheticEvent, useState } from 'react';
import { makeStyles } from "tss-react/mui"


import { NewsCardTab } from '../components/NewsCardTab';

import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { TabPanel } from '../../../shared/components/tabs/tabPanel';
import { RoadmapCardTab } from '../components/RoadmapCardTab';




export const NewsPage = () => {

    const { l10n } = useAppLocalization()

    const [value, setValue] = useState(0);


    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };






    return (
        <Box sx={{ width: '100%', pt: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab value={0} label={l10n.getString("news-gopay")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={1} label={l10n.getString("news-roadmap")} wrapped sx={{ textTransform: 'none' }} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <NewsCardTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <RoadmapCardTab />
            </TabPanel>
        </Box >
    )
}


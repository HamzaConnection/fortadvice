
import { Tabs, Tab } from '@mui/material';
import { Box } from '@mui/system';

import { SyntheticEvent, useState } from 'react';
import { TabPanel } from '../../../../../shared/components/tabs/tabPanel';
import { RatingsOverviewTab } from '../components/RatingsOverviewTab';
import { MatchEnvironment } from '../../../../environment/components/MatchEnvironment';
import { EnvironmentType } from '../../../../environment/envTypes';
import { AllRatingsTab } from '../components/AllRatingsTab';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { RatingCommentsTab } from '../components/RatingCommentsTab';
import { ComingSoonPlaceholder } from '../../../../../shared/components/placeholders/ComingSoonPlaceholder';

import SurveyAnimation from '../../../../../shared/assets/animation_ljydnlcw.json'


export function Survey() {
    const [value, setValue] = useState(0);
    const { l10n } = useAppLocalization()


    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <MatchEnvironment environments={[EnvironmentType.Prod, EnvironmentType.QA, EnvironmentType.Demo]}>
                {
                    <ComingSoonPlaceholder title={l10n.getString("survey-placeholder-title")} body={l10n.getString("survey-placeholder-subtitle")} lottieAnimation={SurveyAnimation} />
                }
            </MatchEnvironment>

            <MatchEnvironment environments={[EnvironmentType.Local, EnvironmentType.Test]}>
                <Box sx={{ width: '100%', pt: '1rem' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab value={0} label={l10n.getString("survey-tab-overview")} wrapped sx={{ textTransform: 'none' }} />
                            <Tab value={1} label={l10n.getString("survey-tab-ratings")} wrapped sx={{ textTransform: 'none' }} />
                            <Tab value={2} label={l10n.getString("survey-tab-comment")} wrapped sx={{ textTransform: 'none' }} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <RatingsOverviewTab />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AllRatingsTab />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <RatingCommentsTab />
                    </TabPanel>
                </Box >
            </MatchEnvironment>

        </>
    )
}

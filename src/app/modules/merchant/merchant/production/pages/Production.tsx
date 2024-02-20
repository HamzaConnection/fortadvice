import { Tabs, Tab } from '@mui/material';
import { Box } from '@mui/system';
import { SyntheticEvent, useState } from 'react';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { TabPanel } from '../../../../../shared/components/tabs/tabPanel';
import { ProductionListTab } from './ProductionListTab';
import OrderTab from './OrderTab';

export function Production() {

    const [value, setValue] = useState(0);
    const { l10n } = useAppLocalization()

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', pt: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab value={0} label={l10n.getString("production-list")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={1} label={l10n.getString("production-order")} wrapped sx={{ textTransform: 'none' }} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <ProductionListTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <OrderTab />
            </TabPanel>
        </Box >
    )
}

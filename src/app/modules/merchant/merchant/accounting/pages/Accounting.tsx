import { Tabs, Tab } from '@mui/material';
import { Box } from '@mui/system';
import { SyntheticEvent, useState } from 'react';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { TabPanel } from '../../../../../shared/components/tabs/tabPanel';
import { ProductSalesTab } from '../components/ProductSalesTab';
import { OrderAccountingTab } from '../components/OrderAccountingTab';
import { BalanceTab } from '../components/BalanceTab';
import { SubscriptionAccountingTab } from '../components/SubscriptionAccountingTab';
import { MatchEnvironment } from '../../../../environment/components/MatchEnvironment';
import { EnvironmentType } from '../../../../environment/envTypes';
import { CustomerAccountingTab } from '../components/CustomerAccountingTab';
import { UserBalanceTab } from '../components/UserBalanceTab';


export function Accounting() {

    const [value, setValue] = useState(0);
    const { l10n } = useAppLocalization()

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', pt: '1rem' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab value={0} label={l10n.getString("accounting-tab-product-sales")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={1} label={l10n.getString("accounting-tab-order")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={2} label={l10n.getString("accounting-tab-subscription")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={3} label={l10n.getString("accounting-tab-cash-register")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={4} label={l10n.getString("accounting-tab-customer")} wrapped sx={{ textTransform: 'none' }} />
                    <Tab value={5} label={l10n.getString("accounting-tab-customer-balance")} wrapped sx={{ textTransform: 'none' }} />
                </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
                <ProductSalesTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <OrderAccountingTab />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <SubscriptionAccountingTab />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <BalanceTab />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <CustomerAccountingTab />
            </TabPanel>
            <TabPanel value={value} index={5}>
                <UserBalanceTab />
            </TabPanel>


        </Box >
    )
}

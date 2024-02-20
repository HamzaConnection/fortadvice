import { Grid, MenuItem, Tab, Tabs } from '@mui/material';
import { Box } from '@mui/system';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import React, { SyntheticEvent } from 'react';
import { useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { MERCHANT_ADMIN_PRICE_LIST_ROUTE, MERCHANT_ADMIN_PRODUCT_GROUP_ROUTE } from '../../../../../constants/routes';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { StandardChip } from '../../../../../shared/components/badges/StandardChip';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { ConfirmModal } from '../../../../../shared/components/dialogs/ConfirmModal';
import { FormikDropdown, FormikTextField } from '../../../../../shared/components/forms/Formik';
import { Breadcrumb, BreadcrumbLink, StandardBreadcrumbs } from '../../../../../shared/components/links/StandardBreadcrumbs';
import { StandardNoResultText } from '../../../../../shared/components/noResult/StandardNoResultText';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { TabPanel } from '../../../../../shared/components/tabs/tabPanel';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable';
import { useDateTime } from '../../../../localization/useDateTime';
import { FormMainPanel } from '../../../../office/admin/components/TenantForm';
import { useAppSelector } from '../../../../store/storeHooks';
import { DetailedPriceList } from '../components/DetailedPriceList';
import { deletePriceList, fetchDetailedPriceLists, fetchPriceLists, PriceListType } from '../priceListApi';
import * as Yup from "yup"


const useStyles = makeStyles()((theme) => ({

}))


type CreatePriceListProps = Readonly<{

}>


type FormValues = Readonly<{
    name: string,
    shops: string
}>


export function CreatePriceList({ }: CreatePriceListProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    const merchantId = useAppSelector(selectEffectiveCompanyId)










    const [value, setValue] = useState(0);
    const [shop, setShop] = useState("");

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    const initialValues = {
        name: "",
        shops: ""
    }


    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required(l10n.getString("price-list-required-name")),
        shops: Yup.string()
    })

    function handleSubmit(values: FormValues, _helpers: FormikHelpers<FormValues>) {
        console.log(values);

    }



    return (
        <>
            <Grid container justifyContent={"space-between"}>
                <Grid item>
                    <PageHeader title={l10n.getString("price-list-create")} page={Page.MERCHANT_PRICE_LIST}>
                        <StandardBreadcrumbs>
                            <LocalizedStrict id='price-lists'>
                                <BreadcrumbLink to={MERCHANT_ADMIN_PRICE_LIST_ROUTE}>Price list</BreadcrumbLink>
                            </LocalizedStrict>

                            <LocalizedStrict id='price-list-create'>
                                <Breadcrumb>Create</Breadcrumb>
                            </LocalizedStrict>
                        </StandardBreadcrumbs>
                    </PageHeader>

                </Grid>

                <Grid item alignSelf={"end"}>
                    <LocalizedStrict id='create'>
                        <StandardButton>Create</StandardButton>
                    </LocalizedStrict>
                </Grid>
            </Grid>

            <Box sx={{ width: '100%', pt: '1rem' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab value={0} label={l10n.getString("price-list-tab-general")} wrapped sx={{ textTransform: 'none' }} />
                        <Tab value={1} label={l10n.getString("price-list-tab-customers")} wrapped sx={{ textTransform: 'none' }} />
                        <Tab value={2} label={l10n.getString("price-list-tab-products")} wrapped sx={{ textTransform: 'none' }} />
                    </Tabs>
                </Box>


                <TabPanel value={value} index={0}>

                    <Formik<FormValues>
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >

                        <FormikTextField<FormValues>
                            name="name"
                            label={l10n.getString("name")}
                            fullWidth
                        />

                    </Formik>

                    {/* <FormikDropdown<FormValues> name="shops" label={"Select a shop (translate)"} fullWidth onChange={(e) => console.log(e.target)}

                    >
                        <MenuItem value={"Shop 1"}> Shop 1</MenuItem>
                        <MenuItem value={"Shop 2"}> Shop 2</MenuItem>
                    </FormikDropdown> */}




                </TabPanel>
                <TabPanel value={value} index={1}>

                </TabPanel>
                <TabPanel value={value} index={2}>

                </TabPanel>
            </Box>






        </>
    )
}



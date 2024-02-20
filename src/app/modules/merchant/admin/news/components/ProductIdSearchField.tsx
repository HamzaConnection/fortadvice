import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FormikValues, useFormikContext } from 'formik';

import { useState } from 'react';
import { StringKeyOf } from '../../../../../shared/components/Formik/FormikCheckbox';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { FormikAutoComplete } from '../../../../../shared/components/forms/Formik';




export type ProductListType = Readonly<{
    id: string
    title: string;
    price: number;
    priceList: string;
}>


type ProductIdSearchFieldProps<FormValues extends FormikValues> = Readonly<{
    name: StringKeyOf<FormValues>;

}>


export function ProductIdSearchField<FormValues extends FormikValues>({ name }: ProductIdSearchFieldProps<FormValues>) {
    const { l10n } = useAppLocalization()


    const data = [
        { id: "1", title: 'Sodavand', price: 20, priceList: "PriceList A" },
        { id: "2", title: 'Sodavand', price: 20, priceList: "PriceList A" },
        { id: "3", title: 'Cola', price: 20, priceList: "PriceList A" },
        { id: "4", title: 'Ale', price: 20, priceList: "PriceList A" },
        { id: "5", title: 'Sodavand', price: 25, priceList: "PriceList A" },
        { id: "6", title: 'Sodavand', price: 23, priceList: "PriceList A" },
        { id: "7", title: 'Sodavand', price: 20, priceList: "PriceList B" },
        { id: "8", title: 'Sodavand', price: 20, priceList: "PriceList B" },
        { id: "9", title: 'Sodavand', price: 20, priceList: "PriceList C" },
        { id: "10", title: 'Sodavand', price: 20, priceList: "PriceList C" },
        { id: "11", title: 'Cola', price: 20, priceList: "PriceList C" },
    ];


    const sortedOptions = data.sort((a, b) => {
        const sortedByPriceList = -b.priceList.localeCompare(a.priceList)
        if (sortedByPriceList === 0) {
            return -b.title.localeCompare(a.title)
        } else {
            return sortedByPriceList
        }
    }

    )

    return (
        <FormikAutoComplete<FormValues, ProductListType>
            name={name}
            label={l10n.getString("create-or-edit-merchant-article-product-id")}
            options={sortedOptions}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            groupBy={(option) => option.priceList}
            getOptionLabel={(option) => `${option.title}, ${option.price} DKK`}
            fullWidth
            renderInput={() => <TextField />}
        />
    );
}




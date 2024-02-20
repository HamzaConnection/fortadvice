import { useCallback, useMemo } from 'react'
import { Box } from '@mui/system'
import { makeStyles } from 'tss-react/mui'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { AccountingDebitor } from '../../accounting/accountingTypes'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { FetchCustomersResponse, fetchCustomersForMerchant } from '../../../../customers/customerApi'
import { useAppSelector } from '../../../../store/storeHooks'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'
import { ApiQueryAutocomplete } from '../../../../../core/api/components/ApiQueryAutocomplete'

type GroupedDebitor = AccountingDebitor & Readonly<{
    group: string
}>

const useStyles = makeStyles()((theme) => ({
    input: {
        width: "16rem",
        backgroundColor: theme.palette.common.white,
    }
}))

type SelectCustomerProps = Readonly<{
    className?: string,
    setCustomerId: React.Dispatch<React.SetStateAction<string | undefined>>
    setCustomerGroupId: React.Dispatch<React.SetStateAction<string | undefined>>
}>

export function SelectCustomer({ className, setCustomerId, setCustomerGroupId }: SelectCustomerProps) {
    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const allItem = useMemo<GroupedDebitor>(() => ({
        type: "customer",
        group: l10n.getString("select-customer-all"),
        id: -1,
        name: l10n.getString("select-customer-all"),
        isActive: true,
        hasSales: false,
    }), [l10n])

    const selector = useCallback((data: FetchCustomersResponse) => {
        const mappedData = data.customers.flatMap((customer) => {
            if (customer.isOfficeHotel && customer.userGroups) {
                const groupDebitors: GroupedDebitor[] = customer.userGroups.map((userGroup) => ({
                    type: "customerGroup",
                    group: customer.name,
                    id: userGroup.id,
                    customerId: customer.id,
                    name: userGroup.name,
                    isActive: userGroup.isActive,
                    hasSales: false,
                }))
                return groupDebitors

            } else {
                const customerDebitor: GroupedDebitor = {
                    type: "customer",
                    group: customer.name,
                    id: customer.id,
                    name: customer.name,
                    isActive: customer.isActive,
                    hasSales: false,
                }
                return customerDebitor
            }
        })

        const sortedData = mappedData.filter(el => el !== undefined)
            .sort((a, b) => {
                const sortedByGroup = -b.group.localeCompare(a.group)
                if (sortedByGroup === 0) {
                    return -b.name.localeCompare(a.name)
                } else {
                    return sortedByGroup
                }
            })

        sortedData.unshift(allItem)

        return sortedData

    }, [allItem])

    const customersResult = useApiQuery(fetchCustomersForMerchant, {
        queryName: "customers-for-merchant",
        dependencies: {
            merchantId: merchantId ?? 0,
            isActive: true,
        },
        select: selector,
        enabled: Boolean(merchantId),
    })

    const data = useMemo(() => customersResult.data ?? [allItem], [customersResult.data, allItem])

    return (
        <Box className={cx(className,)}>
            <LocalizedStrict id="select-customer" attrs={{ label: true }}>
                <ApiQueryAutocomplete
                    isLoading={customersResult.isLoading}
                    isError={customersResult.isError}
                    disableClearable
                    options={data}
                    defaultValue={data[0]}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    groupBy={(option) => option.group}
                    getOptionLabel={(option) => `${option.name}`}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ ml: "0.5rem" }} {...props}>
                            {option.name}
                        </Box>
                    )}
                    onChange={(e, value) => {
                        if (value.type === "customerGroup") {
                            setCustomerId(value.customerId.toString())
                            setCustomerGroupId(value.id.toString())
                        } else if (value.type === "customer" && value.id > 0) {
                            setCustomerId(value.id.toString())
                            setCustomerGroupId(undefined)
                        } else {
                            setCustomerId(undefined)
                            setCustomerGroupId(undefined)
                        }
                    }}
                    className={classes.input}
                />
            </LocalizedStrict>
        </Box >
    )
}

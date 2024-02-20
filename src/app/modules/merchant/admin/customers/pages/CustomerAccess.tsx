import { useMemo } from "react"
import { List, ListItem, ListItemText } from "@mui/material"
import { faBuildings } from "@fortawesome/pro-light-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { makeStyles } from "tss-react/mui"
import { MRT_ColumnDef } from "material-react-table"
import { StandardChip } from "../../../../../shared/components/badges/StandardChip"
import { PageHeader } from "../../../../../shared/components/pageHeader/PageHeader"
import { Page } from "../../../../../shared/components/pageHeader/PageHeaderApi"
import { useAppSelector } from "../../../../store/storeHooks"
import { useAppLocalization } from "../../../../localization/components/AppLocalizationProvider"
import { LocalizedStrict } from "../../../../localization/components/AppLocalized"
import { selectEffectiveCompanyId } from "../../../../context/contextSelectors"
import { useApiQuery } from "../../../../../core/api/useApiQuery"
import { useApiQueryTable } from "../../../../../core/api/components/ApiQueryTable"
import { BusinessCustomer, CompanyCustomer } from "../../../../customers/customerTypes"
import { FetchCustomersResponse, fetchCustomersForMerchant } from "../../../../customers/customerApi"

function transformData(data: FetchCustomersResponse): BusinessCustomer[] {
    return data.customers.flatMap((customer) => {
        if (customer.isOfficeHotel) {
            const userGroups = customer.userGroups ?? customer.customerGroups ?? []

            const tenants: BusinessCustomer[] = userGroups.map((tenant) => ({
                type: "tenant",
                id: tenant.id,
                customerId: customer.id,
                name: tenant.name,
                isActive: tenant.isActive,
                domains: tenant.domains ?? [],
            }))

            return tenants
        } else {
            const company: CompanyCustomer = {
                type: "company",
                id: customer.id,
                name: customer.name,
                isActive: customer.isActive,
                domains: customer.domains ?? [],
            }

            return company
        }
    })
}

const useStyles = makeStyles()((_theme) => ({
    page: {
        paddingTop: "3rem",
    },
    customerTable: {
        marginTop: "3rem",
    },
    singleCell: {
        verticalAlign: "baseline",
    },
}))

type Props = Readonly<{}>

export function CustomerAccessPage({ }: Props) {
    const { classes } = useStyles()

    const merchantId = useAppSelector(selectEffectiveCompanyId)
    const { l10n } = useAppLocalization()

    const customersResult = useApiQuery(fetchCustomersForMerchant, {
        queryName: "customers-for-merchant",
        dependencies: { merchantId: merchantId ?? 0 },
        select: transformData,
        enabled: Boolean(merchantId),
    })

    const { ApiQueryTable } = useApiQueryTable(customersResult)

    const columns = useMemo<MRT_ColumnDef<BusinessCustomer>[]>(() => {
        return [
            {
                header: l10n.getString("merchant-customer-access-customers-table-name-column"),
                accessorKey: "name",
                muiTableBodyCellProps: { className: classes.singleCell },
                minSize: 50,
                maxSize: 1000,
                size: 200,
            },
            {
                header: l10n.getString("merchant-customer-access-customers-table-domains-column"),
                accessorFn: (originalRow) => originalRow.domains.join(", "),
                Cell: ({ row }) => {
                    return (
                        <List disablePadding>
                            {row.original.domains.map((domain) => (
                                <ListItem key={`domain-${domain}`} disablePadding disableGutters>
                                    <ListItemText primaryTypographyProps={{ variant: "body2" }}>
                                        {domain}
                                    </ListItemText>
                                </ListItem>
                            ))}
                        </List>
                    )
                },
            },
            {
                header: l10n.getString("merchant-customer-access-customers-table-active-column"),
                accessorFn: (originalRow) => (originalRow.isActive ? 'yes' : 'no'), // must be a string
                Cell: ({ row }) => {
                    if (row.original.isActive) {
                        return (
                            <LocalizedStrict id="merchant-customer-access-customers-table-active-column-active">
                                <StandardChip variant="success">Active</StandardChip>
                            </LocalizedStrict>
                        )
                    } else {
                        return (
                            <LocalizedStrict id="merchant-customer-access-customers-table-active-column-inactive">
                                <StandardChip variant="red">Inactive</StandardChip>
                            </LocalizedStrict>
                        )
                    }
                },
                filterVariant: "select",
                filterSelectOptions: [
                    {
                        value: "yes", text: l10n.getString("merchant-customer-access-customers-table-active-filter-yes")
                    },
                    {
                        value: "no", text: l10n.getString("merchant-customer-access-customers-table-active-filter-no")
                    },
                ],
                muiTableHeadCellProps: {
                    align: "center",
                },
                muiTableBodyCellProps: {
                    align: "center",
                    className: classes.singleCell,
                },
            },
        ]
    }, [l10n])

    return (
        <div className={classes.page}>

            <PageHeader title={l10n.getString("merchant-customer-access-header")} page={Page.MERCHANT_CUSTOMER_ACCESS} icon={<FontAwesomeIcon icon={faBuildings} />}>
            </PageHeader>

            <ApiQueryTable
                defaultColumn={{
                    minSize: 5,
                    maxSize: 5,
                    size: 5,
                }}
                enableStickyHeader
                enableDensityToggle={false}
                enableHiding={false}
                columns={columns}
                muiTablePaperProps={{
                    className: classes.customerTable,
                }}
            />
        </div>
    )
}

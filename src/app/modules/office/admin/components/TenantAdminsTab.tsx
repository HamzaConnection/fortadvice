import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, MenuItem } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { MRT_ColumnDef } from "material-react-table"
import { FetchTenantAdminsResponse, fetchTenantAdmins } from "../tenantAdminApi"
import { useApiQuery } from "../../../../core/api/useApiQuery"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { useApiQueryTable } from "../../../../core/api/components/ApiQueryTable"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { StandardChip } from "../../../../shared/components/badges/StandardChip"
import { Button } from "./Button"
import { ConfirmModal } from "../../../../shared/components/dialogs/ConfirmModal"
import { UserDetailsDialog } from "./UserDetailsDialog"
import { TENANT_USERS_CREATE_ADMIN_ROUTE } from "../../../../constants/routes"
import { Admin, TenantOfficeManager } from "../../../users/userTypes"
import { CreateOrUpdateAdminState } from "../pages/CreateOrEditTenantAdmin"
import { useApiMutation } from "../../../../core/api/useApiMutation"
import { deleteAdmin } from "../../../users/userApi"
import { useCurrentTenant } from "../../tenantHooks"

function transformData(data: FetchTenantAdminsResponse) {
    return data.administrators
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

export function TenantAdminsTab() {
    const { classes } = useStyles()

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [user, setUser] = useState<Admin>()
    const navigate = useNavigate()

    const { l10n } = useAppLocalization()
    const { companyId, userGroupId } = useCurrentTenant()

    const tenantAdmins = useApiQuery(fetchTenantAdmins, {
        queryName: "admins-for-tenant",
        dependencies: {
            companyId: companyId,
            userGroupId: userGroupId,
        },
        select: transformData,
    })

    const { ApiQueryTable } = useApiQueryTable(tenantAdmins)

    const { mutateAsync: callDeleteAdmin } = useApiMutation(deleteAdmin, {})

    function handleDeleteClick() {
        if (user === undefined) {
            return
        } else {
            callDeleteAdmin({
                userId: user.user.id,
            })
        }
    }

    const columns = useMemo<MRT_ColumnDef<TenantOfficeManager>[]>(
        () => [
            {
                header: l10n.getString("office-manager-users-table-name-column"),
                // accessorKey: "user.displayName",
                accessorFn: (row) => row.user.displayName,
                // muiTableBodyCellProps: { className: classes.singleCell },
                minSize: 50,
                maxSize: 500,
                size: 200,
            },
            {
                header: l10n.getString("office-manager-users-table-email-column"),
                accessorKey: "user.email",
                muiTableBodyCellProps: { className: classes.singleCell },
                minSize: 50,
                maxSize: 1000,
                size: 200,
            },
            {
                id: "is-active",
                header: l10n.getString("office-manager-users-table-status-column"),
                // Need to transform value to a string for filtering to work properly
                accessorFn: (originalRow) => originalRow.user.isActive.toString(),
                Cell: ({ row }) => {
                    if (row.original?.user.isActive) {
                        return (
                            <LocalizedStrict id="office-manager-users-table-status-column-active">
                                <StandardChip variant="success">Active</StandardChip>
                            </LocalizedStrict>
                        )
                    } else {
                        return (
                            <LocalizedStrict id="office-manager-users-table-status-column-inactive">
                                <StandardChip variant="red">Inactive</StandardChip>
                            </LocalizedStrict>
                        )
                    }
                },
                filterVariant: "select",
                filterSelectOptions: [
                    {
                        value: "true",
                        text: l10n.getString("merchant-customer-access-customers-table-active-filter-yes"),
                    },
                    {
                        value: "false",
                        text: l10n.getString("merchant-customer-access-customers-table-active-filter-no"),
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
        ],
        [l10n],
    )

    return (
        <>
            <Grid container>
                <Grid item container xs={12} direction="row" justifyContent="flex-end" mt={3}>
                    <LocalizedStrict id="office-manager-users-create-admin-button">
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate(TENANT_USERS_CREATE_ADMIN_ROUTE)
                            }}
                        >
                            Create admin
                        </Button>
                    </LocalizedStrict>
                </Grid>
                <Grid item xs={12}>
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
                        enableRowActions
                        positionActionsColumn="last"
                        displayColumnDefOptions={{
                            "mrt-row-actions": {
                                header: "",
                            },
                        }}
                        renderRowActionMenuItems={({ row, closeMenu }) => [
                            <LocalizedStrict id="office-manager-user-show-details">
                                <MenuItem
                                    key={row.original.user.id}
                                    onClick={() => {
                                        setUser(row.original)
                                        setShowDetailsModal(true)
                                        closeMenu()
                                    }}
                                >
                                    Show details
                                </MenuItem>
                            </LocalizedStrict>,
                            <LocalizedStrict id="office-manager-user-edit">
                                <MenuItem
                                    key={row.original.user.id}
                                    onClick={() => {
                                        setUser(row.original)
                                        const navState: CreateOrUpdateAdminState = { user: row.original }
                                        navigate(TENANT_USERS_CREATE_ADMIN_ROUTE, { state: navState })
                                        closeMenu()
                                    }}
                                >
                                    Edit user
                                </MenuItem>
                            </LocalizedStrict>,
                            <LocalizedStrict id="office-manager-user-delete">
                                <MenuItem
                                    key={row.original.user.id}
                                    onClick={() => {
                                        setUser(row.original)
                                        setShowDeleteModal(true)
                                        closeMenu()
                                    }}
                                >
                                    Delete user
                                </MenuItem>
                            </LocalizedStrict>,
                        ]}
                    />

                    {user && (
                        <ConfirmModal
                            buttonLabelSubmit={l10n.getString("delete-news-modal-button-delete-label")}
                            domainTitle={l10n.getString("office-manager-user-delete")}
                            handleClick={handleDeleteClick}
                            subject={user.user.displayName}
                            open={showDeleteModal}
                            onClose={() => setShowDeleteModal(false)}
                        />
                    )}

                    {user && (
                        <UserDetailsDialog
                            user={user}
                            open={showDetailsModal}
                            onClose={() => setShowDetailsModal(false)}
                        />
                    )}
                </Grid>
            </Grid>
        </>
    )
}

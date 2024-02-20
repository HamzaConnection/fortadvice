import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Grid, MenuItem } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import type { MRT_ColumnDef } from "material-react-table"
import { FetchTenantUsersResponse, fetchTenantUsers } from "../tenantAdminApi"
import { useApiQuery } from "../../../../core/api/useApiQuery"
import { LocalizedStrict } from "../../../localization/components/AppLocalized"
import { useApiQueryTable } from "../../../../core/api/components/ApiQueryTable"
import { useAppLocalization } from "../../../localization/components/AppLocalizationProvider"
import { StandardChip } from "../../../../shared/components/badges/StandardChip"
import { ConfirmModal } from "../../../../shared/components/dialogs/ConfirmModal"
import { Button } from "./Button"
import { TENANT_USERS_CREATE_USER_ROUTE } from "../../../../constants/routes"
import { useApiMutation } from "../../../../core/api/useApiMutation"
import { User } from "../../../users/userTypes"
import { UserDetailsDialog } from "./UserDetailsDialog"
import { CreateOrUpdateUserState } from "../pages/CreateOrEditTenantUser"
import { deleteUser } from "../../../users/userApi"
import { useCurrentTenant } from "../../tenantHooks"

function transformData(data: FetchTenantUsersResponse) {
    return data.users
}

const useStyles = makeStyles()((theme) => ({
    page: {
        paddingTop: "3rem",
    },
    table: {
        marginTop: "3rem",
    },
    singleCell: {
        verticalAlign: "baseline",
    },
}))

export function TenantUsersTab() {
    const { classes } = useStyles()

    const [user, setUser] = useState<User>()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    const navigate = useNavigate()

    const { l10n } = useAppLocalization()
    const { companyId, userGroupId } = useCurrentTenant()

    const columns = useMemo<MRT_ColumnDef<User>[]>(
        () => [
            {
                header: l10n.getString("office-manager-users-table-id-column"),
                accessorKey: "id",
                muiTableBodyCellProps: { className: classes.singleCell },
                minSize: 100,
                maxSize: 150,
                // size: 100,
            },
            {
                header: l10n.getString("office-manager-users-table-name-column"),
                accessorKey: "displayName",
                muiTableBodyCellProps: { className: classes.singleCell },
                minSize: 100,
                maxSize: 300,
                size: 200,
            },
            {
                header: l10n.getString("office-manager-users-table-email-column"),
                accessorKey: "email",
                muiTableBodyCellProps: { className: classes.singleCell },
                minSize: 100,
                maxSize: 300,
                size: 200,
            },
            {
                id: "is-active",
                header: l10n.getString("office-manager-users-table-status-column"),
                accessorFn: (originalRow) => originalRow.isActive.toString(),
                Cell: ({ row }) => {
                    if (row.original?.isActive) {
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
                minSize: 100,
                maxSize: 150,
                size: 100,
                filterVariant: "select",
                filterSelectOptions: [
                    {
                        value: "true",
                        text: l10n.getString("office-manager-users-table-status-column-active"),
                    },
                    {
                        value: "false",
                        text: l10n.getString("office-manager-users-table-status-column-inactive"),
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
        [l10n, classes],
    )

    const tenantUsers = useApiQuery(fetchTenantUsers, {
        queryName: "users-for-tenant",
        dependencies: {
            companyId: companyId,
            userGroupId: userGroupId,
        },
        select: transformData,
    })

    const { ApiQueryTable } = useApiQueryTable(tenantUsers)
    const { mutateAsync: callDeleteUser } = useApiMutation(deleteUser, {})

    function handleDeleteClick() {
        if (user === undefined) {
            return
        } else {
            callDeleteUser({
                userId: user.id
            })
        }
    }

    return (
        <Grid container>
            <Grid item container xs={12} direction="row" justifyContent="flex-end" mt={3}>
                <LocalizedStrict id="office-manager-users-create-user-button">
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigate(TENANT_USERS_CREATE_USER_ROUTE)
                        }}
                    >
                        Create user
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
                        className: classes.table,
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
                                key={row.original.id}
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
                                key={row.original.id}
                                onClick={() => {
                                    setUser(row.original)
                                    const navState: CreateOrUpdateUserState = { user: row.original }
                                    navigate(TENANT_USERS_CREATE_USER_ROUTE, { state: navState })
                                    closeMenu()
                                }}
                            >
                                Edit user
                            </MenuItem>
                        </LocalizedStrict>,
                        <LocalizedStrict id="office-manager-user-delete">
                            <MenuItem
                                key={row.original.id}
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
                        subject={user.displayName}
                        open={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                    />
                )}

                {user && (
                    <UserDetailsDialog user={user} open={showDetailsModal} onClose={() => setShowDetailsModal(false)} />
                )}
            </Grid>
        </Grid>
    )
}

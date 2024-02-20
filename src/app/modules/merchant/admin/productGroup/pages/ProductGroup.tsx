import { Grid, MenuItem } from '@mui/material';
import { MRT_ColumnDef, MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { MERCHANT_ADMIN_PRICE_LIST_ROUTE } from '../../../../../constants/routes';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { useApiQuery } from '../../../../../core/api/useApiQuery';
import { StandardChip } from '../../../../../shared/components/badges/StandardChip';
import { StandardButton } from '../../../../../shared/components/buttons/StandardButton';
import { ConfirmModal } from '../../../../../shared/components/dialogs/ConfirmModal';
import { StandardNoResultText } from '../../../../../shared/components/noResult/StandardNoResultText';
import { PageHeader } from '../../../../../shared/components/pageHeader/PageHeader';
import { Page } from '../../../../../shared/components/pageHeader/PageHeaderApi';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable';
import { useDateTime } from '../../../../localization/useDateTime';
import { useAppSelector } from '../../../../store/storeHooks';
import { deleteProductGroup, fetchProductGroups, ProductGroup } from '../productGroupApi';

const useStyles = makeStyles()((theme) => ({

}))


type ProductGroupPageProps = Readonly<{

}>

export function ProductGroupPage({ }: ProductGroupPageProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmModalText, setConfirmModalText] = useState("")
    const [productGroupId, setProductGroupId] = useState<number>()



    const columns = useMemo<MRT_ColumnDef<ProductGroup>[]>(
        () => [
            {
                header: l10n.getString("product-group-code"),
                accessorKey: 'productGroupCode',
            },
            {
                header: l10n.getString("name"),
                accessorKey: 'name',
            },
            {
                header: l10n.getString("status"),
                accessorKey: 'isActive',
                Cell: ({ row }) => {
                    return (
                        <>
                            {row.original.isActive ? <StandardChip label={l10n.getString("inactive")} variant='success' /> : <StandardChip label={l10n.getString("inactive")} variant='red' />}
                        </>
                    )
                },

            },

        ],
        [],
    );

    const productGroupList = useApiQuery(fetchProductGroups, {
        queryName: "get-product-group-list",
        baseURL: mockServerUrl,
        dependencies: {
            merchantId: merchantId ?? 0,
        },
        enabled: Boolean(merchantId),
    })

    const { mutateAsync: callDeleteProductGroup } = useApiMutation(deleteProductGroup, {
        async onSuccess(params, data, context) {
            enqueueSnackbar({
                variant: "success",
                message: l10n.getString("price-list-delete-success-message"),
            })
        },

    })




    const tableData = useMemo(() => {
        try {
            return productGroupList.data?.productGroups
        } catch (error: any) {
            // TODO test if you still need this since it's handled globally
            return []
        }

    }, [productGroupList.data?.productGroups])



    return (
        <>
            <Grid paddingTop="3rem" container justifyContent={"space-between"}>

                <Grid item>
                    <PageHeader title={l10n.getString("product-group")} page={Page.MERCHANT_PRICE_LIST}> </PageHeader>
                </Grid>

                <Grid item alignSelf={"end"}>
                    <LocalizedStrict id='product-group-create'>
                        <StandardButton> Add product group</StandardButton>
                    </LocalizedStrict>
                </Grid>
            </Grid>


            <Grid paddingTop="0.5rem">
                {tableData?.length === 0 &&
                    <Grid container justifyContent={"center"} rowGap="1rem">
                        < StandardNoResultText noResultText='There are no price lists. Please create you first price list' />
                        <Grid item>
                            <LocalizedStrict id='price-list-create'>
                                <StandardButton> Create price list</StandardButton>
                            </LocalizedStrict>
                        </Grid>
                    </Grid>
                }


                <LocalizedMaterialReactTable
                    columns={columns}
                    data={tableData ?? []}
                    defaultColumn={{
                        minSize: 5, //allow columns to get smaller than default
                        maxSize: 5, //allow columns to get larger than default
                        size: 5, //make columns wider by default
                    }}

                    enableClickToCopy={false}
                    enableColumnOrdering
                    enableStickyHeader
                    enableDensityToggle={false}
                    initialState={{ density: 'spacious' }}
                    enableHiding={false}
                    enableRowActions
                    enableGrouping
                    muiTableContainerProps={{ sx: { maxHeight: "100%" } }}
                    positionActionsColumn="last"
                    enableColumnDragging={false}
                    enableExpandAll={false}
                    renderRowActionMenuItems={({ row, closeMenu }) => [
                        (
                            <MenuItem onClick={() => {

                                closeMenu()
                            }}>
                                {l10n.getString("edit")}
                            </MenuItem>
                        ),
                        (
                            <MenuItem onClick={() => {
                                setShowConfirmModal(true)
                                setConfirmModalText(`${row.original.name}`)
                                setProductGroupId(row.original.id)
                                closeMenu()
                            }}>
                                {l10n.getString("delete")}
                            </MenuItem>
                        ),
                    ]}
                    displayColumnDefOptions={{
                        'mrt-row-actions': {
                            header: '',
                        },
                    }}
                    renderToolbarInternalActions={({ table }) => (
                        <Grid paddingTop={"1rem"}>
                            <MRT_ToggleGlobalFilterButton table={table} />
                            <MRT_FullScreenToggleButton table={table} />
                        </Grid>
                    )}
                    state={{
                        isLoading: productGroupList.isLoading,
                        showProgressBars: productGroupList.isFetching
                    }}

                />
            </Grid>

            {showConfirmModal && <ConfirmModal buttonLabelSubmit={l10n.getString("delete")} domainTitle={l10n.getString("price-list-delete")} subject={confirmModalText} handleClick={() => {

                if (productGroupId) {
                    callDeleteProductGroup({ id: productGroupId, merchantId: merchantId ?? 0 })
                } else {
                    throw new Error("Product group id is undefined");
                }
            }

            } onClose={() => setShowConfirmModal(false)} open={showConfirmModal} />}

        </>
    )
}



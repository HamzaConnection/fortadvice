import { Grid, MenuItem } from '@mui/material';
import { MRT_ColumnDef, MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { makeStyles } from 'tss-react/mui';
import { mockServerUrl } from '../../../../../constants/apiUrl';
import { MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE, MERCHANT_ADMIN_PRICE_LIST_ROUTE } from '../../../../../constants/routes';
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
import { DetailedPriceList } from '../components/DetailedPriceList';
import { deletePriceList, fetchDetailedPriceLists, fetchPriceLists, PriceListType } from '../priceListApi';

const useStyles = makeStyles()((theme) => ({

}))


type PriceListProps = Readonly<{

}>

export function PriceList({ }: PriceListProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})

    const merchantId = useAppSelector(selectEffectiveCompanyId)

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmModalText, setConfirmModalText] = useState("")

    const [priceListId, setPriceListId] = useState<number>()

    const navigate = useNavigate()



    const columns = useMemo<MRT_ColumnDef<PriceListType>[]>(
        () => [
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

    const priceLists = useApiQuery(fetchPriceLists, {
        queryName: "get-price-lists",
        baseURL: mockServerUrl,
        dependencies: {
            merchantId: merchantId ?? 0,
        },
        enabled: Boolean(merchantId),
    })




    const tableData = useMemo(() => {
        try {
            return priceLists.data?.priceLists
        } catch (error: any) {
            // TODO test if you still need this since it's handled globally
            return []
        }

    }, [priceLists.data?.priceLists])


    const { mutateAsync: callDeletePriceList } = useApiMutation(deletePriceList, {
        async onSuccess(params, data, context) {
            enqueueSnackbar({
                variant: "success",
                message: l10n.getString("price-list-delete-success-message"),
            })
        },

    })

    return (
        <>

            <Grid paddingTop="3rem" container justifyContent={"space-between"}>

                <Grid item>

                    <PageHeader title={l10n.getString("price-lists")} page={Page.MERCHANT_PRICE_LIST}></PageHeader>

                </Grid>

                <Grid item alignSelf={"end"}>
                    <LocalizedStrict id='price-list-create'>
                        <StandardButton onClick={() => navigate(MERCHANT_ADMIN_CREATE_PRICE_LIST_ROUTE)}> Create price list</StandardButton>
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
                    renderDetailPanel={({ row }) => {
                        return <DetailedPriceList id={row.original.id} />
                    }}

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
                                setPriceListId(row.original.id)
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
                        isLoading: priceLists.isLoading,
                        showProgressBars: priceLists.isFetching
                    }}

                />
            </Grid>

            {showConfirmModal && <ConfirmModal buttonLabelSubmit={l10n.getString("delete")} domainTitle={l10n.getString("price-list-delete")} subject={confirmModalText} handleClick={() => {

                if (priceListId) {
                    callDeletePriceList({ id: priceListId })
                } else {
                    throw new Error("Price list id is undefined");
                }
            }

            } onClose={() => setShowConfirmModal(false)} open={showConfirmModal} />}

        </>
    )
}



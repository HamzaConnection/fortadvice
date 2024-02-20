import { MenuItem } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { MRT_ColumnDef, MRT_FullScreenToggleButton, MRT_ToggleGlobalFilterButton } from 'material-react-table'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreateOrEditMerchantArticleState } from './CreateOrEditMerchantArticle'
import { MerchantArticleStatus, MerchantArticleType, MerchantNewsArticle } from '../merchantNewsItemType'
import { useAppSelector } from '../../../../store/storeHooks'
import { deleteMerchantAdminNews, fetchMerchantAdminArchiveNews } from '../merchantAdminNewsApi'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { MERCHANT_CREATE_NEWS_ROUTE } from '../../../../../constants/routes'
import { ConfirmModal } from '../../../../../shared/components/dialogs/ConfirmModal'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { Badge } from '../components/Badge'
import { LocalizedMaterialReactTable } from '../../../../localization/components/LocalizedMaterialReactTable'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'
import { useApiMutation } from '../../../../../core/api/useApiMutation'

const useStyles = makeStyles()((theme) => ({
    newsGrid: {
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center"
        },
    }
}))


const newsData: MerchantNewsArticle[] = [
    {
        "id": 246,
        "type": MerchantArticleType.EXTERNAL_ARTICLE,
        "status": MerchantArticleStatus.EXPIRED,
        "imageUrl": "https://picsum.photos/350/300",
        "subject": "Rate our food and win a teacup pig! This is published",
        "permaLink": "https://showItem/2",
        "created": "2022-10-20 10:15:00",
        "updated": "2022-10-20 10:15:00",
        "publishDate": "2022-10-20"
    },
    {
        "id": 248,
        "type": MerchantArticleType.EXTERNAL_ARTICLE,
        "status": MerchantArticleStatus.EXPIRED,
        "imageUrl": "https://picsum.photos/500/400",
        "subject": "Guests can now purchase food using credit card in the canteen. Also article will be published December 2023.",
        "permaLink": "https://showItem/2",
        "created": "2022-10-01 23:00:00",
        "updated": "2022-10-10 08:00:00",
        "publishDate": "2023-12-01"
    },
    {
        "id": 332,
        "type": MerchantArticleType.EXTERNAL_ARTICLE,
        "status": MerchantArticleStatus.EXPIRED,
        "imageUrl": "https://picsum.photos/500/400",
        "subject": "Purchase food using credit card in the canteen. Also article will be published December 2023.",
        "permaLink": "https://showItem/3",
        "created": "2022-10-01 23:00:00",
        "updated": "2022-10-10 08:00:00",
        "publishDate": "2023-12-01"
    },
    {
        "id": 247,
        "type": MerchantArticleType.PRODUCT_NEWS,
        "status": MerchantArticleStatus.EXPIRED,
        "productId": "2435",
        "imageUrl": "https://picsum.photos/300/400",
        "subject": "The canteen now serves Corona beer! Also this article will expire in 2024.",
        "created": "2022-10-01 23:00:00",
        "updated": "2022-10-10 08:00:00",
        "publishDate": "2022-10-10",
        "expirationDate": "2024-01-01"
    }

]





export const MerchantArchiveNewsTab = () => {
    const { classes } = useStyles()

    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [article, setArticle] = useState<MerchantNewsArticle>()

    const merchantId = useAppSelector(selectEffectiveCompanyId)
    const queryResult = useApiQuery(fetchMerchantAdminArchiveNews, {
        queryName: "get-merchant-admin-archive-news",
        dependencies: {
            merchantId: merchantId ?? 0
        },
        enabled: Boolean(merchantId)
    })


    const { mutateAsync: callDeleteMerchantAdminNews } = useApiMutation(deleteMerchantAdminNews, {})


    function handleDeleteClick() {
        if (!merchantId || article?.id === undefined) {
            return;
        } else {
            callDeleteMerchantAdminNews({
                merchantId: merchantId,
                articleId: article?.id ?? 0
            })
        }
    }
    const { l10n } = useAppLocalization()

    const columns = useMemo<MRT_ColumnDef<MerchantNewsArticle>[]>(
        () => [
            {
                // TODO: translations
                header: l10n.getString("news-archive-title"),
                accessorKey: 'subject'
            },
            {
                header: l10n.getString("news-archive-expiration-date"),
                accessorKey: 'expirationDate'
            },
            {
                header: l10n.getString("news-archive-active-status"),
                accessorKey: 'status',

                Cell: ({ row }) => {
                    const value = row.original.status

                    return <>{Badge({ articleStatus: value ?? MerchantArticleStatus.EXPIRED, className: "" })}</>
                },
            },
        ], [],
    );

    return (
        <>
            <LocalizedMaterialReactTable
                columns={columns}
                data={newsData}
                enableClickToCopy={false}
                enableColumnOrdering
                enableStickyHeader
                enableStickyFooter
                enableDensityToggle={false}
                initialState={{ density: 'spacious' }}
                enableHiding={false}
                enableRowActions
                enableGrouping
                positionActionsColumn="last"
                enableColumnDragging={false}
                muiTableContainerProps={{ sx: { maxHeight: "100%" } }}
                renderRowActionMenuItems={({ row, closeMenu }) => [

                    (<LocalizedStrict id='news-edit'>
                        <MenuItem key={row.original.id} onClick={() => {
                            setArticle(row.original)
                            const navState: CreateOrEditMerchantArticleState = { article }
                            navigate(MERCHANT_CREATE_NEWS_ROUTE, { state: navState })
                            closeMenu()
                        }}>
                            Edit
                        </MenuItem>
                    </LocalizedStrict >),

                    (<LocalizedStrict id='news-delete'>
                        <MenuItem key={row.original.id} onClick={() => {
                            setArticle(row.original)
                            setShowDeleteModal(true)
                            closeMenu()
                        }
                        }>
                            Delete
                        </MenuItem>
                    </LocalizedStrict >)
                ]}
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        header: '',
                    },
                }}
                renderToolbarInternalActions={({ table }) => (
                    <>
                        <MRT_ToggleGlobalFilterButton table={table} />
                        <MRT_FullScreenToggleButton table={table} />
                    </>
                )}
                state={{
                    isLoading: queryResult.isLoading,
                    showProgressBars: queryResult.isFetching,
                }}
            />

            {article && <ConfirmModal buttonLabelSubmit={l10n.getString("delete-news-modal-button-delete-label")} domainTitle={l10n.getString("create-or-edit-merchant-article-delete")} handleClick={handleDeleteClick} subject={article.subject} open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />}
        </>
    )
}

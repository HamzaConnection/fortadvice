import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui';

import { Box } from '@mui/system';
import { CardDropdownMenu } from './CardDropdownMenu';
import { Badge } from './Badge';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MerchantNewsArticle } from '../merchantNewsItemType';
import { MERCHANT_CREATE_NEWS_ROUTE } from '../../../../../constants/routes';
import { LocalizedStrict } from '../../../../localization/components/AppLocalized';
import { ConfirmModal } from '../../../../../shared/components/dialogs/ConfirmModal';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useAppSelector } from '../../../../store/storeHooks';
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors';
import { useApiMutation } from '../../../../../core/api/useApiMutation';
import { deleteMerchantAdminNews } from '../merchantAdminNewsApi';


type MerchantNewsCardProps = Readonly<{
    article: MerchantNewsArticle
}>

export function MerchantNewsCard({ article }: MerchantNewsCardProps) {
    const navigate = useNavigate();
    const { l10n } = useAppLocalization()



    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const useStyles = makeStyles()((theme) => ({
        newsGrid: {
            justifyContent: "center",
            border: 'none',
            alignSelf: 'flex-start',
            "&:hover": {
                transform: "scale(1.02)",
                transition: 'all .3s ease-in-out'
            },

        },
        card: {
            position: "relative",
            width: "32%", // set according to gap %
            cursor: 'pointer',
            [theme.breakpoints.down(1000)]: {
                width: "49%", // set according to gap %
            },

            [theme.breakpoints.down("sm")]: {
                width: "100%",
            },
        },

        cardContent: {
            "&:last-child": {
                paddingBottom: 0
            },
            padding: "0",
            paddingBottom: "0",
            paddingTop: '0.3rem'
        },

        chip: {
            padding: '0.1rem',
            borderRadius: 0,
            position: "absolute",
            top: 0,
            right: 0,
        }
    }))


    const { classes, cx } = useStyles()

    const handleCardClick = () => {
        navigate(MERCHANT_CREATE_NEWS_ROUTE, { state: { article: article } })

    }

    const merchantId = useAppSelector(selectEffectiveCompanyId)
    const { mutateAsync: callDeleteMerchantAdminNews } = useApiMutation(deleteMerchantAdminNews, {})


    function handleDeleteClick() {
        if (!merchantId) {
            return;
        } else {
            callDeleteMerchantAdminNews({
                merchantId: merchantId,
                articleId: article.id
            })
        }
    }



    return (
        <Card variant='outlined' className={cx(classes.newsGrid, classes.card)}>
            <CardMedia src={article.imageUrl ?? undefined} component="img" onClick={() => {
                handleCardClick()
            }} />
            {Badge({ articleStatus: article?.status, className: classes.chip })}

            <CardContent className={cx(classes.cardContent)}>
                <Box sx={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6" fontWeight={400} sx={{ lineHeight: "1.5rem" }}>
                        {article.subject}
                    </Typography>
                    <CardDropdownMenu article={article} setShowDeleteModal={setShowDeleteModal} />
                </Box>
                <Typography sx={{ fontSize: 12, lineHeight: "0.7rem" }} color="text.secondary" gutterBottom>

                    {article.publishDate &&
                        <LocalizedStrict id="news-published" vars={{ date: article.publishDate }}>
                            <p>
                                Published: {article.publishDate}
                            </p>
                        </LocalizedStrict>
                    }
                </Typography>

            </CardContent>
            <ConfirmModal buttonLabelSubmit={l10n.getString("delete-news-modal-button-delete-label")} domainTitle={l10n.getString("create-or-edit-merchant-article-delete")} subject={article.subject} question={l10n.getString("delete-news-modal-confirm-label")} handleClick={handleDeleteClick} open={showDeleteModal} onClose={() => setShowDeleteModal(false)} />
        </Card >
    )
}

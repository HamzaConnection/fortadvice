import { useMediaQuery, useTheme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { MerchantNewsCard } from '../components/MerchantNewsCard'
import { AddMerchantNewsCardButton } from '../components/AddMerchantNewsCardButton'
import { MerchantArticleStatus, MerchantArticleType, MerchantNewsArticle } from '../merchantNewsItemType'
import { useAppSelector } from '../../../../store/storeHooks'
import { useApiQuery } from '../../../../../core/api/useApiQuery'
import { fetchMerchantAdminNews } from '../merchantAdminNewsApi'
import { Masonry } from '@mui/lab'
import { NoNewsPlaceholder } from '../components/NoNewsPlaceholder'
import { MERCHANT_CREATE_NEWS_ROUTE } from '../../../../../constants/routes'
import { selectEffectiveCompanyId } from '../../../../context/contextSelectors'



const useStyles = makeStyles()((theme) => ({
}))


const news: MerchantNewsArticle[] = [
    {
        "id": 245,
        "type": MerchantArticleType.NORMAL_ARTICLE,
        "status": MerchantArticleStatus.DRAFT,
        "imageUrl": "https://picsum.photos/400/300",
        "subject": "You can now purchase leftover food",
        "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "created": "2022-06-07 00:17:22",
        "updated": "2022-11-01 08:00:00"
    },
    {
        "id": 246,
        "type": MerchantArticleType.EXTERNAL_ARTICLE,
        "status": MerchantArticleStatus.PUBLISHED,
        "imageUrl": "https://picsum.photos/350/300",
        "subject": "Rate our food and win a teacup pig! This is published",
        "permaLink": "https://showItem/2",
        "created": "2022-10-20 10:15:00",
        "updated": "2022-10-20 10:15:00",
        "publishDate": "2022-10-20"
    },
    {
        "id": 247,
        "type": MerchantArticleType.PRODUCT_NEWS,
        "status": MerchantArticleStatus.PUBLISHED,
        "productId": "2435",
        "imageUrl": "https://picsum.photos/300/400",
        "subject": "The canteen now serves Corona beer! Also this article will expire in 2024.",
        "created": "2022-10-01 23:00:00",
        "updated": "2022-10-10 08:00:00",
        "publishDate": "2022-10-10",
        "expirationDate": "2024-01-01"
    },
    {
        "id": 248,
        "type": MerchantArticleType.EXTERNAL_ARTICLE,
        "status": MerchantArticleStatus.SCHEDULED,
        "imageUrl": "https://picsum.photos/500/400",
        "subject": "Guests can now purchase food using credit card in the canteen. Also article will be published December 2023.",
        "permaLink": "https://showItem/2",
        "created": "2022-10-01 23:00:00",
        "updated": "2022-10-10 08:00:00",
        "publishDate": "2023-12-01"
    }
]





export const MerchantNewsTab = () => {
    const { classes } = useStyles()

    const companyId = useAppSelector(selectEffectiveCompanyId)
    const queryResult = useApiQuery(fetchMerchantAdminNews, {
        queryName: "get-merchant-admin-news",
        dependencies: {
            merchantId: companyId ?? 0
        },
        enabled: Boolean(companyId),
    })


    const theme = useTheme();
    const matches1000 = useMediaQuery(theme.breakpoints.down(1000));
    const matchesSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const setColumns = () => {
        if (matchesSmallScreen) {
            return 1;
        }
        if (matches1000) {
            return 2;
        }

        return 3;
    }

    const setSpacing = () => {
        if (matches1000) {
            return 3;
        }

        return 4;
    }

    return (
        <>
            {news.length === 0 && <NoNewsPlaceholder header='news-no-news-title' body='news-no-news-body' linkText='news-no-news-here-link' link={MERCHANT_CREATE_NEWS_ROUTE} />}

            <Masonry sx={{ margin: 0, alignItems: "center" }} columns={setColumns()} spacing={setSpacing()}>
                {news.length > 0 && <AddMerchantNewsCardButton />}

                {news && news.map((item) => {
                    return (<MerchantNewsCard article={item} />)
                })}
            </Masonry>
        </>
    )
}

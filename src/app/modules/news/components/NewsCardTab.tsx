import { useApiQuery } from '../../../core/api/useApiQuery'
import { fetchGoPayNews } from '../newsApi'
import { useMediaQuery } from '@mui/material'
import { NewsCard } from './NewsCard'
import { makeStyles } from "tss-react/mui"
import Masonry from '@mui/lab/Masonry';
import { useTheme } from '@mui/system'
import { NoNewsPlaceholder } from '../../merchant/admin/news/components/NoNewsPlaceholder'


const useStyles = makeStyles()((theme) => ({
    newsGrid: {
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center"
        },
    }
}))



export const NewsCardTab = () => {
    const theme = useTheme();
    const matches1000 = useMediaQuery(theme.breakpoints.down(1000));
    const matchesSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { classes } = useStyles()

    const queryResult = useApiQuery(fetchGoPayNews, {
        queryName: "get-gopay-news",
        dependencies: {},
    })

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
            {queryResult.data?.news && queryResult.data.news.length === 0 && <NoNewsPlaceholder header='news-no-news-title' />}
            <Masonry sx={{ margin: 0, alignItems: "center" }} columns={setColumns()} spacing={setSpacing()} >
                <></>
                {queryResult.data?.news && queryResult.data?.news.map((item) => {
                    return (<NewsCard news={item} />)
                })}
            </Masonry>
        </>
    )
}


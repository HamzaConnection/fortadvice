import { Card, CardContent, Typography, CardMedia } from '@mui/material'
import Image from '../../../modules/login/assets/large-GoPay-manager-Forside-en.jpg'
import { makeStyles } from "tss-react/mui"
import { NewsItem } from '../newsTypes'
import { useExternalLinks } from '../../../shared/hooks/useAppLinks'



type NewsCardProps = Readonly<{
    news: NewsItem
}>

export const NewsCard = ({ news }: NewsCardProps) => {
    const useStyles = makeStyles()((theme) => ({
        newsGrid: {
            justifyContent: "center",
            border: 'none',
            alignSelf: 'flex-start',
            "&:hover": {
                transform: "scale(1.02)",
                transition: 'all .3s ease-in-out'
            }
        },
        card: {
            cursor: 'pointer',
            width: "33,33%", // set according to gap %


            // paddingBottom: "0",
            // marginBottom: '0',
            // [theme.breakpoints.down(1000)]: {
            //     width: "49.5%", // set according to gap %
            // },

            // [theme.breakpoints.down("sm")]: {
            //     width: "100%",
            // },
        },


    }))

    const { classes, cx } = useStyles()

    const handleExternalLink = useExternalLinks();

    return (
        <Card key={news.subject} variant='outlined' className={cx(classes.newsGrid, classes.card)} onClick={() => handleExternalLink(news.permaLink)}>
            <CardMedia src={news.imageUrl} component="img" />
            <CardContent sx={{ padding: "0", paddingBottom: '0', paddingTop: '0.3rem' }}>
                <Typography variant="h6" fontWeight={400} sx={{ lineHeight: "1.5rem" }}>
                    {news.subject}
                </Typography>
            </CardContent>
        </Card >
    )
}


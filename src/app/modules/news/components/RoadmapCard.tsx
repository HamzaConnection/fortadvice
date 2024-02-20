import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CardActions, CardContent, Chip, Grid, IconButton, SvgIcon, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui';
import { RoadmapItem, RoadmapItemType } from '../newsTypes';
import { useExternalLinks } from '../../../shared/hooks/useAppLinks';
import { RoadmapImplementationType } from '../newsTypes';
import { getShortDescription } from '../../../lib/stringLib';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { grey } from '@mui/material/colors';



type RoadmapCardProps = {
    roadmap: RoadmapItem
}

export const RoadmapCard = ({ roadmap }: RoadmapCardProps) => {


    const useStyles = makeStyles()((theme) => ({
        newsGrid: {
            justifyContent: "center",
            alignSelf: 'flex-start',
            "&:hover": {
                transform: "scale(1.02)",
                transition: 'all .3s ease-in-out'
            }
        },
        card: {
            height: "15.5rem",
            backgroundColor: grey[50],
            cursor: "pointer",
            [theme.breakpoints.down(750)]: {
                height: "20rem"
            },

            [theme.breakpoints.down("sm")]: {
                height: "14rem"
            },

            [theme.breakpoints.down(450)]: {
                height: "20rem"
            },


        },

        chip: {
            padding: '0.1rem',
            margin: '-1.5rem',
            borderRadius: 0

        }
    }))

    const { classes, cx } = useStyles()


    const getBadge = (roadmapItem: RoadmapItem) => {

        const details = roadmapItem.roadmapDetails
        if (roadmapItem.roadmapDetails?.itemType === RoadmapItemType.UPCOMING) {
            return <Chip color="primary" label={roadmapItem.roadmapDetails?.itemType} className={classes.chip} />
        } else if (details?.itemType === RoadmapItemType.IMPLEMENTED && details.implementationType === RoadmapImplementationType.FEATURE) {
            return <Chip color="success" label={roadmapItem.roadmapDetails.implementationType} className={classes.chip} />
        }
        else if (details?.itemType === RoadmapItemType.IMPLEMENTED && details.implementationType === RoadmapImplementationType.BUGFIX) {
            return <Chip color="error" label={roadmapItem.roadmapDetails.implementationType} className={classes.chip} />
        }
        else {
            return ""
        }
    }

    const handleExternalLink = useExternalLinks();
    return (
        <Card variant='outlined' className={cx(classes.newsGrid, classes.card)} onClick={() => handleExternalLink(roadmap.permaLink)}>
            <Grid container wrap='nowrap' direction={"column"} justifyContent={"space-between"} className={classes.card}>


                <CardContent sx={{ padding: '1.5rem', paddingTop: '1.5rem', paddingBottom: "0" }}>
                    <Grid container wrap="nowrap" justifyContent="space-between" alignItems="flex-start">
                        <Typography sx={{ fontSize: 16, mr: '2.5rem', lineHeight: "1.3rem" }} variant='subtitle2' gutterBottom>
                            {roadmap.subject}
                        </Typography>
                        {getBadge(roadmap)}
                    </Grid>

                    {roadmap.roadmapDetails.itemType === RoadmapItemType.IMPLEMENTED && (
                        <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
                            <LocalizedStrict id="news-published" vars={{ date: roadmap.publishDate }}>
                                <span>
                                    Published: {roadmap.publishDate}
                                </span>
                            </LocalizedStrict>
                        </Typography>
                    )}

                    {roadmap.roadmapDetails.itemType === RoadmapItemType.IMPLEMENTED && (
                        <Typography sx={{ fontSize: 10 }} color="text.secondary" gutterBottom>
                            <LocalizedStrict id="news-implemented" vars={{ date: roadmap.roadmapDetails.implementationDate }}>
                                <span>
                                    Released: {roadmap.roadmapDetails.implementationDate}
                                </span>
                            </LocalizedStrict>
                        </Typography>
                    )}


                    <Typography variant="body2" >
                        {getShortDescription(roadmap.shortDescription)}
                    </Typography>
                </CardContent>

                <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: "0.8rem" }}>
                    <SvgIcon >
                        <FontAwesomeIcon icon={faChevronRight} color="black" size="1x" />
                    </SvgIcon>
                </CardActions>
            </Grid>
        </Card>
    )
}


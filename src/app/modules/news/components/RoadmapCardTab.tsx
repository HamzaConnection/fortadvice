import { Alert, FormControl, Grid, InputLabel, MenuItem, Select, Snackbar, useMediaQuery, useTheme } from '@mui/material'
import { RoadmapCard } from './RoadmapCard'
import { RoadmapImplementationType, RoadmapItemType } from '../newsTypes';
import { useApiQuery } from '../../../core/api/useApiQuery';
import { makeStyles } from 'tss-react/mui';
import { fetchRoadmapByPeriod } from '../newsApi';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { DatePicker } from '@mui/x-date-pickers';
import { useAppLocalization } from '../../localization/components/AppLocalizationProvider';
import { LocalizedStrict } from '../../localization/components/AppLocalized';
import { useDateTime } from '../../localization/useDateTime';
import Masonry from '@mui/lab/Masonry';
import { NoNewsPlaceholder } from '../../merchant/admin/news/components/NoNewsPlaceholder';

type SelectType = RoadmapItemType | RoadmapImplementationType | "All"

const useStyles = makeStyles()((theme) => ({
    newsGrid: {
        [theme.breakpoints.down("sm")]: {
            justifyContent: "center"
        },
    }
}))


export const RoadmapCardTab = () => {
    const { classes } = useStyles()
    const { l10n } = useAppLocalization()

    const theme = useTheme();
    const matches1050 = useMediaQuery(theme.breakpoints.down(1050));
    const matchesSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const queryResult = useApiQuery(fetchRoadmapByPeriod, {
        queryName: "get-gopay-roadmap",
        dependencies: {},
    })



    const [startDate, setStartDate] = useState<DateTime>(DateTime.now().minus({ year: 1 }));


    const [endDate, setEndDate] = useState<DateTime>(DateTime.now());

    const [roadmapType, setRoadmapType] = useState<SelectType>("All")

    const dateTimeFactory = useDateTime()

    const [showErrorToaster, setShowErrorToaster] = useState(false)
    const [errorMessage, setErrorMessage] = useState(l10n.getString('news-default-error-message'))



    const setColumns = () => {
        if (matchesSmallScreen) {
            return 1;
        }
        if (matches1050) {
            return 2;
        }

        return 3;
    }

    const setSpacing = () => {
        if (matches1050) {
            return 3;
        }

        return 4;
    }





    const filterByDateAndType = (startDate: DateTime, endDate: DateTime) => {
        const filteredByDate = queryResult.data?.roadmaps?.filter(roadmap => {
            const publishDate = dateTimeFactory.fromISO(roadmap.publishDate)
            return publishDate >= startDate && publishDate <= endDate
        })

        if (roadmapType === "All") {
            return filteredByDate;
        }

        if (roadmapType === RoadmapItemType.UPCOMING || roadmapType === RoadmapItemType.IMPLEMENTED) {
            const filteredByUpcoming = filteredByDate?.filter(roadmap => {
                return roadmap.roadmapDetails.itemType === roadmapType
            })

            return filteredByUpcoming

        } else if (roadmapType) {
            const filteredByType = filteredByDate?.filter(roadmap => {
                return roadmap.roadmapDetails.itemType === RoadmapItemType.IMPLEMENTED && roadmap.roadmapDetails.implementationType === roadmapType;
            })

            return filteredByType

        }
        return filteredByDate;
    }


    const data = useMemo(() => {

        try {
            if (queryResult.data?.roadmaps) {
                return filterByDateAndType(startDate, endDate)
            }
            return queryResult.data?.roadmaps
        } catch (error: any) {
            setErrorMessage(error.displayMessage)
            setShowErrorToaster(true)
            return []
        }
    }, [startDate, endDate, queryResult.data, roadmapType])


    return (

        <>

            <Snackbar open={showErrorToaster} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={5000} onClose={() => setShowErrorToaster(false)}>
                <Alert onClose={() => setShowErrorToaster(false)} sx={{ marginBottom: "2rem", marginRight: "1rem" }}
                    severity="error" variant="filled">{errorMessage}
                </Alert>
            </Snackbar>


            <Grid container direction={'column'} width="100%">
                <Grid container justifyContent="start" alignItems="center" paddingBottom="1rem" marginLeft="1rem">
                    <DatePicker
                        sx={{ width: "9rem", marginRight: "2rem", marginBottom: "1rem" }}
                        value={startDate}
                        onChange={(newValue) => {
                            if (newValue) {
                                setStartDate(newValue)
                            }
                        }}
                        label={l10n.getString("news-start-date")}
                        slotProps={{ textField: { variant: "standard", size: "small" } }}
                    />
                    <DatePicker
                        sx={{ width: "9rem", marginRight: "2rem", marginBottom: "1rem" }}
                        value={endDate}
                        onChange={(newValue) => {
                            if (newValue) {
                                setEndDate(newValue)
                            }
                        }}
                        label={l10n.getString("news-end-date")}
                        slotProps={{ textField: { variant: "standard", size: "small" } }}
                    />

                    <FormControl variant='standard' sx={{ width: "10rem", marginBottom: "1.2rem" }}>
                        <LocalizedStrict id='news-type'>
                            <InputLabel>Type</InputLabel>
                        </LocalizedStrict>
                        <Select<SelectType>
                            onChange={(e) => {
                                setRoadmapType(e.target.value as RoadmapItemType | RoadmapImplementationType);
                            }}
                            value={roadmapType}
                        >

                            <MenuItem value={"All"}>
                                <LocalizedStrict id='news-all'>
                                    <span>
                                        All
                                    </span>
                                </LocalizedStrict>
                            </MenuItem>
                            <MenuItem value={RoadmapImplementationType.BUGFIX}>
                                <LocalizedStrict id='news-bug-fix'>
                                    <span>
                                        Bug fix
                                    </span>
                                </LocalizedStrict>
                            </MenuItem>
                            <MenuItem value={RoadmapImplementationType.FEATURE}>
                                <LocalizedStrict id='news-new-feature'>
                                    <span>New feature</span>
                                </LocalizedStrict>
                            </MenuItem>
                            <MenuItem value={RoadmapItemType.UPCOMING}>
                                <LocalizedStrict id='news-upcoming'>
                                    <span>Upcoming</span>
                                </LocalizedStrict>
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {data && data.length === 0 && <NoNewsPlaceholder header='news-no-news-title' />}

                <Masonry sx={{ margin: 0, alignItems: "center" }} columns={setColumns()} spacing={setSpacing()}>
                    <></>
                    {data && data.map((item) => {
                        return (<RoadmapCard roadmap={item} />)
                    })}
                </Masonry>
            </Grid>
        </>

    )
}


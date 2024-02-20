import { faFileInvoiceDollar } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCircleInfo } from '@fortawesome/sharp-regular-svg-icons';
import { Divider, Grid, List, ListItemButton, Tooltip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { useApiQuery } from '../../../core/api/useApiQuery';
import { StandardDialog } from '../dialogs/StandardDialog';
import { useExternalLinks } from '../../hooks/useAppLinks';
import { LocalizedStrict } from '../../../modules/localization/components/AppLocalized';
import { fetchPageHelpContent, Page } from './PageHeaderApi';



export type PageHeaderProps = {
    children?: React.ReactNode | undefined
    page: Page
    icon?: JSX.Element
    title: string
}


const useStyles = makeStyles()((theme) => ({

    container: {
        paddingBottom: theme.spacing(16),
        marginTop: "-1rem",
    },

    tooltip: {
        "&:hover": {
            cursor: "pointer"
        },
    }
}))




export function PageHeader({ children, page, icon, title }: PageHeaderProps) {

    const [showModal, setShowModal] = useState(false)

    // TODO Hamza use queryResult when backend is ready
    const pageHelpContent = useApiQuery(fetchPageHelpContent, {
        queryName: "get-help-page-content",
        dependencies: {
            page: page
        },
    })


    const { classes, cx } = useStyles()


    const handleExternalLink = useExternalLinks();

    return (
        <>
            <Grid marginTop={"2rem"}>
                {children}
                <Grid container direction="row" alignItems="center" alignContent="center" marginTop={"1rem"}>
                    <Typography variant="h2" display="inline" paddingRight="0.5rem" color="InfoText">
                        {title}
                    </Typography>
                    {pageHelpContent.data && <Tooltip className={classes.tooltip} title="Click here for more info" onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faCircleInfo} size={'lg'} style={{ color: "GrayText", }} />
                    </Tooltip>}
                </Grid>

                <StandardDialog
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    maxWidthProp='md'
                >

                    <Grid container width="800px" marginLeft={"5rem"} justifyContent="center" alignItems="flex-start" direction="column" wrap="wrap" className={classes.container}>

                        <Grid item>
                            <Typography variant='h4' sx={{ marginBottom: "0.5rem", }}>
                                {icon}
                                {pageHelpContent.data?.pageHelp?.title}
                            </Typography>
                        </Grid>

                        <Grid item >
                            <Typography variant='body1' sx={{ marginTop: "1.5rem" }}>
                                {pageHelpContent.data?.pageHelp?.text}
                            </Typography>
                        </Grid>

                        {(pageHelpContent.data?.pageHelp?.helpGuides?.length ?? 0) > 0 &&
                            <>
                                <Grid item>
                                    <LocalizedStrict id='pageheader-helptext'>
                                        <Typography variant='h6' sx={{ marginTop: "4rem", marginBottom: "1rem" }}>
                                            Hjælpeguides
                                        </Typography>
                                    </LocalizedStrict>
                                </Grid>

                                <List sx={{ width: '100%', maxWidth: "90%", bgcolor: 'background.paper', }}
                                    component="nav">
                                    {pageHelpContent.data?.pageHelp.helpGuides.map((article) => {
                                        return <>
                                            <Divider />
                                            <ListItemButton sx={{ marginY: "0.5rem", display: "flex", width: "100%" }} onClick={() => handleExternalLink(article.url)}>
                                                <Box sx={{ marginY: "0.5rem", width: "100%" }}>
                                                    {article?.title}
                                                </Box>
                                                <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: "0.5rem", justifyContent: "end" }} />
                                            </ListItemButton>
                                            <Divider />
                                        </>
                                    })}
                                    <Divider />
                                </List>
                            </>}
                    </Grid>
                </StandardDialog >
            </Grid>

        </>
    )
}

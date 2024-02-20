import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Grid } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { faCircleExclamation } from '@fortawesome/pro-light-svg-icons';
import { useState } from 'react';
import { Box } from '@mui/system';

const useStyles = makeStyles()((theme) => ({

}))


type TableToolbarBannerProps = Readonly<{
    showNotPrintedOrders: boolean,
    setShowNotPrintedOrders: React.Dispatch<React.SetStateAction<boolean>>
}>

export function TableToolbarBanner({ showNotPrintedOrders, setShowNotPrintedOrders }: TableToolbarBannerProps) {

    const { classes, cx } = useStyles()




    return (
        <Box sx={{ paddingBottom: "1rem" }}>
            {!showNotPrintedOrders &&
                <Grid container alignItems={"center"} >
                    <FontAwesomeIcon icon={faCircleExclamation} size="xl" style={{ color: "#f58891", paddingRight: "0.5rem" }} /> Receipts not printed on the cloud printer. <Button onClick={() => setShowNotPrintedOrders(true)} variant="text" sx={{ textTransform: "none" }}>Show</Button>
                </Grid>
            }
            {showNotPrintedOrders &&
                <>
                    <FontAwesomeIcon icon={faCircleExclamation} size="xl" style={{ color: "#f58891", paddingRight: "0.5rem" }} /> Showing unprinted orders. <Button onClick={() => setShowNotPrintedOrders(false)} variant="text" sx={{ textTransform: "none" }}>Clear filter</Button>
                </>
            }

        </Box>
    )
}


import { Card, CardContent } from '@mui/material'
import { makeStyles } from 'tss-react/mui';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useNavigate } from 'react-router-dom';
import { faCirclePlus } from '@fortawesome/pro-solid-svg-icons';
import { grey } from '@mui/material/colors';
import { CSSProperties } from 'react';
import { MERCHANT_CREATE_NEWS_ROUTE } from '../../../../../constants/routes';



export function AddMerchantNewsCardButton() {

    const navigate = useNavigate()


    const useStyles = makeStyles()((theme) => ({
        newsGrid: {
            justifyContent: "center",
            border: 'none',
            alignSelf: 'flex-start',
            backgroundColor: grey[300],
            "&:hover": {
                transform: "scale(1.02)",
                transition: 'all .3s ease-in-out'
            },
            marginBottom: "1rem"

        },
        card: {
            width: "32%", // set according to gap %
            cursor: 'pointer',
            height: "275px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            [theme.breakpoints.down(1000)]: {
                width: "49%", // set according to gap %
            },

            [theme.breakpoints.down("sm")]: {
                width: "100%",
            },
        },
    }))



    const { classes, cx } = useStyles()

    return (
        <Card variant='outlined' className={cx(classes.newsGrid, classes.card)} onClick={() => { navigate(MERCHANT_CREATE_NEWS_ROUTE) }}>
            <CardContent>
                <FontAwesomeIcon icon={faCirclePlus} style={{ color: "#a1a1a1" } as CSSProperties} size='10x' />
            </CardContent>
        </Card >
    )
}

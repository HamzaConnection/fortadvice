import { Chip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';


const useStyles = makeStyles()((theme) => ({
    status: {
        borderRadius: theme.shape.borderRadius * 2,
    },
}))


type StandardBadgeProps = {
    isTrue: boolean | undefined
    labelTrue: string,
    labelFalse: string
}

export default function BooleanBadge({ isTrue, labelTrue, labelFalse }: StandardBadgeProps) {
    const { classes } = useStyles()

    const display = (isTrue: boolean | undefined) => {
        if (isTrue) {
            return (<Chip label={labelTrue} color="success" variant="outlined" className={classes.status} sx={{ backgroundColor: "#bbfcd3" }}></Chip>)
        } else {
            return (<Chip label={labelFalse} color="error" variant="outlined" className={classes.status} sx={{ backgroundColor: "#ffe3e3" }}></Chip>)
        }
    }
    return (
        <>
            {display(isTrue)}
        </>
    )
}

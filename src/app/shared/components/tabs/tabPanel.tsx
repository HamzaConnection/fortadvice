import { PropsWithChildren } from 'react'
import { Box } from '@mui/system'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
    content: {
        paddingTop: theme.spacing(3),
    },
}))

type TabPanelProps = Readonly<PropsWithChildren<{
    index: number
    value: number
}>>

export function TabPanel(props: TabPanelProps) {
    const { value, index, children } = props
    const { classes } = useStyles()

    return (
        <div
            id={`tabpanel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            hidden={value !== index}
        >
            {value === index && (
                <Box className={classes.content}>
                    {children}
                </Box>
            )}
        </div>
    )
}

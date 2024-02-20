import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TableCell, TableRow, Typography } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { toDinero } from '../../../../currency/currencyLib';
import { useMoney } from '../../../../currency/useMoney';
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider';
import { useDateTime } from '../../../../localization/useDateTime';
import { faChevronDown, faChevronRight } from '@fortawesome/pro-light-svg-icons'
import { ChevronRight, ExpandMore } from '@mui/icons-material';

const useStyles = makeStyles()((theme) => ({
    expandButton: {
        marginRight: "0.1rem",
    },
    expandButtonExpanded: {
        transform: "rotate(90deg)",
        transition: theme.transitions.create("transform", {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
        })
    },
}))


type ExpandableTableRowProps = Readonly<PropsWithChildren<{
    hasChildren?: boolean
    cellValue: string
    cellValue2: string
}>>

export function ExpandableTableRow({ cellValue, cellValue2, hasChildren, children }: ExpandableTableRowProps) {

    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const dateTimeFactory = useDateTime()
    const moneyFactory = useMoney({})
    const [isExpanded, setIsExpanded] = useState(false)



    return (
        <>
            <TableRow
                key={cellValue}
                sx={{ cursor: hasChildren ? "pointer" : "", }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <TableCell>

                    <IconButton
                        aria-label="expand row"
                        size="small"
                        disableRipple
                        className={cx(classes.expandButton, { [classes.expandButtonExpanded]: isExpanded })}
                    >
                        <ChevronRight />
                    </IconButton>
                    <Typography variant='body2' sx={{ display: "inline", marginLeft: hasChildren ? "0" : "2.4rem" }}>
                        {cellValue}</Typography>
                </TableCell>
                <TableCell sx={{ textAlign: "end" }}>

                </TableCell>
                <TableCell sx={{ textAlign: "end" }}>
                    {cellValue2}
                </TableCell>
            </TableRow>

            {isExpanded && children}
        </>
    )
}



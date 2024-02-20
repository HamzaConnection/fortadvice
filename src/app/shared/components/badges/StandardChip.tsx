import { Chip } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider';
import { PropsWithChildren } from 'react';

const useStyles = makeStyles()((theme) => ({
    borderRadius: {
        borderRadius: theme.shape.borderRadius * 2,
    },
}))


type StandardChipProps = Readonly<PropsWithChildren<{
    className?: string
    label?: string
    variant: "grey" | "primary" | "secondary" | "red" | "info" | "success" | "warning" | undefined
}>>




export function StandardChip({ label, className, variant, children }: StandardChipProps) {
    const { l10n } = useAppLocalization()
    const { classes, cx } = useStyles()

    const labelToUse = children ?? label

    switch (variant) {
        case "success":
            return <Chip label={labelToUse} className={cx(className, classes.borderRadius)} sx={{ border: "1px solid #86EFAC", backgroundColor: "#F0FDF4", color: "#15803D" }} />
        case "grey":
            return <Chip label={labelToUse} className={cx(className, classes.borderRadius)} sx={{ border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", color: "#64748B" }} />

        case "info":
            return <Chip label={labelToUse} className={cx(className, classes.borderRadius)} sx={{ border: "1px solid #0369a1", backgroundColor: "#f0f9ff", color: "#0369a1" }} />

        case "red":
            return <Chip label={labelToUse} className={cx(className, classes.borderRadius)} sx={{ border: "1px solid #FCA5A5", backgroundColor: "#FEF2F2", color: "#B91C1C" }} />

        default:
            return <></>
    }
}



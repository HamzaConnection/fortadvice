import { Chip } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { useAppLocalization } from '../../../modules/localization/components/AppLocalizationProvider'
import { OrderStatus } from '../../../modules/merchant/controlKitchenTypes'
import { StandardChip } from './StandardChip'

type OrderStatusBadgeProps = {
    status: OrderStatus | ""
    className?: string

}

const useStyles = makeStyles()((theme) => ({
    chip: {
        fontWeight: 500,
    }
}))

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
    const { l10n } = useAppLocalization()
    const { classes, cx } = useStyles()


    switch (status) {
        case "CANCELLED":
            return (<StandardChip label={l10n.getString("production-order-status-cancelled")} variant="red" />)


        case "CONFIRMED":
            return (<StandardChip label={l10n.getString("production-order-status-confirmed")} variant="info" />)


        case "READY":
            return (<StandardChip label={l10n.getString("production-order-status-ready")} variant="success" />)


        case "RECEIVED":
            return (<StandardChip label={l10n.getString("production-order-status-received")} variant="grey" />)

        default:
            return <></>

    }
}

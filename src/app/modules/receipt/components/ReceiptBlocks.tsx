import { PropsWithChildren } from "react"
import flattenChildren from "react-keyed-flatten-children"
import { Grid, Skeleton, SkeletonProps, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material"
import { makeStyles } from "tss-react/mui"
import { StrictOmit } from "../../../lib/lang"
import { StandardButton, StandardButtonProps } from "../../../shared/components/buttons/StandardButton"
import { IOrderLine } from "../../payments/orderTypes"

const useStyles = makeStyles()((theme) => ({
    infoItemRow: {
        borderBottom: 0,
        padding: 0,
    },
    actionItem: {
        width: "100%",
        paddingBottom: theme.spacing(2),
    },
    separatorTop: {
        borderTop: "1px solid rgba(224, 224, 224, 1)",
        paddingTop: theme.spacing(2),
    },
    separatorBottom: {
        borderBottom: "1px solid rgba(224, 224, 224, 1)",
        paddingBottom: theme.spacing(2),
    },
    itemCount: {
        width: "1%",
        maxWidth: "8em",
        //        width: "5em",
        paddingRight: 0,
    },
    itemEnd: {
        height: theme.spacing(2),
    },
    header: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(2),
        textAlign: "center",
    },
    section: {
        width: "100%",
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
    },
    container: {
        paddingBottom: theme.spacing(16),
    },
}))

type ReceiptSkeletonProps = StrictOmit<SkeletonProps, "variant" | "animation">

export function ReceiptSkeleton(props: ReceiptSkeletonProps) {
    return (
        <Skeleton variant="rectangular" animation="wave" {...props} />
    )
}

type ReceiptOrderLineProps = Readonly<{
    orderLine?: Pick<IOrderLine, "name" | "items">
    price?: string
    initial: boolean
}>

export function ReceiptOrderLine({ orderLine, price, initial }: ReceiptOrderLineProps) {
    const { classes, cx } = useStyles()

    return (
        <>
            <TableRow>
                <TableCell align="left" className={cx({ [classes.infoItemRow]: true, [classes.itemCount]: true, [classes.separatorTop]: initial })}>
                    {orderLine ? `${orderLine.items}\u00A0x\u00A0` : <ReceiptSkeleton />}
                </TableCell>
                <TableCell align="left" className={cx({ [classes.infoItemRow]: true, [classes.separatorTop]: initial })}>
                    {orderLine ? orderLine.name : <ReceiptSkeleton />}
                </TableCell>
                <TableCell align="right" className={cx({ [classes.infoItemRow]: true, [classes.separatorTop]: initial })}>
                    {orderLine ? (price ?? " ") : <ReceiptSkeleton />}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={3} className={cx(classes.infoItemRow, classes.itemEnd)}>{" "}</TableCell>
            </TableRow>
        </>
    )
}

type ReceiptOrderTotalProps = Readonly<{
    label?: string
    totalPrice?: string
    initial: boolean
}>

export function ReceiptOrderTotal({ label, totalPrice, initial }: ReceiptOrderTotalProps) {
    const { classes, cx } = useStyles()

    return (
        <>
            <TableRow>
                <TableCell align="left" colSpan={2} className={cx({ [classes.infoItemRow]: true, [classes.separatorTop]: initial })}>
                    {label ?? " "}
                </TableCell>
                <TableCell align="right" className={cx({ [classes.infoItemRow]: true, [classes.separatorTop]: initial })}>
                    {totalPrice ? totalPrice : <ReceiptSkeleton />}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={3} className={cx(classes.infoItemRow, classes.itemEnd)}>{" "}</TableCell>
            </TableRow>
        </>
    )
}

type ReceiptInfoItemProps = Readonly<
    PropsWithChildren<{
        label: React.ReactNode
        hide?: boolean
    }>
>

export function ReceiptInfoItem({ label, hide = false, children }: ReceiptInfoItemProps) {
    const { classes, cx } = useStyles()
    const [first, ...rest] = flattenChildren(children)

    if (hide) return null

    return (
        <>
            <TableRow>
                <TableCell align="left" colSpan={2} className={cx(classes.infoItemRow)}>
                    {label}
                </TableCell>
                <TableCell align="right" className={cx(classes.infoItemRow)}>
                    {first}
                </TableCell>
            </TableRow>
            {rest.map((child, index) => (
                <TableRow key={index}>
                    <TableCell align="left" colSpan={2} className={cx(classes.infoItemRow)}>
                        {" "}
                    </TableCell>
                    <TableCell align="right" className={cx(classes.infoItemRow)}>
                        {child}
                    </TableCell>
                </TableRow>
            ))}
            <TableRow>
                <TableCell colSpan={3} className={cx(classes.infoItemRow, classes.itemEnd)}>
                    {" "}
                </TableCell>
            </TableRow>
        </>
    )
}

type CommentNotPresent = Readonly<{
    present: false
}>
type CommentPresent = Readonly<{
    present: true
    text: string
}>
export type Comment = CommentNotPresent | CommentPresent

type ReceiptCommentProps = Readonly<{
    label: string
    comment: Comment | undefined
}>

export function ReceiptCommentItem({ label, comment }: ReceiptCommentProps) {
    const { classes, cx } = useStyles()

    if (comment && !comment.present) return null

    return (
        <>
            <TableRow>
                <TableCell align="left" colSpan={3} className={cx(classes.infoItemRow)}>
                    {comment ? <span>{label}</span> : <ReceiptSkeleton height={50} />}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell align="left" colSpan={3} className={cx(classes.infoItemRow)}>
                    {comment ? <span>{comment.text}</span> : <span>{" "}</span>}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={3} className={cx(classes.infoItemRow, classes.itemEnd)}>
                    {" "}
                </TableCell>
            </TableRow>
        </>
    )
}

type ReceiptActionProps = Readonly<PropsWithChildren<{
    onClick: StandardButtonProps["onClick"]
}>>

export function ReceiptAction({ onClick, children }: ReceiptActionProps) {
    const { classes } = useStyles()

    return (
        <div className={classes.actionItem}>
            <StandardButton variant="outlined" color="primary" onClick={onClick}>
                {children}
            </StandardButton>
        </div>
    )
}

type HeaderProps = Readonly<PropsWithChildren<{}>>

export function HeaderSection({ children }: HeaderProps) {
    const { classes } = useStyles()

    return (
        <Grid item className={classes.section}>
            <Typography variant="h6" className={classes.header}>{children}</Typography>
        </Grid>
    )
}

type SectionProps = Readonly<
    PropsWithChildren<{
        heading: React.ReactNode
        rightElement?: React.ReactNode
        final?: boolean
    }>
>

export function ReceiptSection({ heading, rightElement, final = false, children }: SectionProps) {
    const { classes, cx } = useStyles()

    return (
        <Grid item className={cx({ [classes.section]: true, [classes.separatorBottom]: !final })}>
            <Table>
                <TableBody>
                    <ReceiptInfoItem label={<Typography variant="h6">{heading}</Typography>}>
                        {rightElement}
                    </ReceiptInfoItem>

                    {children}
                </TableBody>
            </Table>
        </Grid>
    )
}

type HeadlessSectionProps = Readonly<
    PropsWithChildren<{
        final?: boolean
    }>
>

export function HeadlessReceiptSection({ final, children }: HeadlessSectionProps) {
    const { classes, cx } = useStyles()

    return (
        <Grid item className={cx({ [classes.section]: true, [classes.separatorBottom]: !final })}>
            {children}
        </Grid>
    )
}

type ReceiptContainerProps = Readonly<PropsWithChildren<{}>>

export function ReceiptContainer({ children }: ReceiptContainerProps) {
    const { classes } = useStyles()

    return (
        <Grid container direction="column" wrap="nowrap" className={classes.container}>
            {children}
        </Grid>
    )
}

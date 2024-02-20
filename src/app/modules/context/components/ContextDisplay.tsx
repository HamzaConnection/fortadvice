import { useNavigate } from "react-router-dom"
import { IconButton, Paper, Typography } from "@mui/material"
import { Close } from "@mui/icons-material"
import { makeStyles } from "tss-react/mui"
import { UnreachableCaseError } from "../../../lib/lang"
import { LocalizedStrict } from "../../localization/components/AppLocalized"
import { useAppDispatch, useAppSelector } from "../../store/storeHooks"
import { Merchant } from "../../supplier/reporting/merchants/merchantTypes"
import { selectActiveContext } from "../contextSelectors"
import { popContext } from "../contextSlice"

const useStyles = makeStyles()((theme) => ({
    wrapper: {
        position: "relative",
    },
    display: {
        padding: theme.spacing(1, 2),
        color: theme.palette.common.white,
        backgroundColor: theme.palette.common.black,
    },
    closeButton: {
        position: "absolute",
        right: 0,
        bottom: 0,
        padding: "2px",
        // Icon inside is 1rem and we have 2px padding in each side
        marginRight: "calc(-1 * (2px + 2px + 1rem) / 2)",
        // Only move the button quarter out vertically to conserve space
        marginBottom: "calc(-1 * (2px + 2px + 1rem) / 4)",
        fontSize: "1rem",
        color: theme.palette.tailwind.slate[50],
        backgroundColor: theme.palette.tailwind.sky[500],
        "&:hover": {
            backgroundColor: theme.palette.tailwind.sky[600],
        }
    }
}))

type OrgUnitDisplayProps = Readonly<{
    label: string
    identifier?: string
    name: string
    returnUrl: string
}>

function OrgUnitDisplay({ label, identifier, name, returnUrl }: OrgUnitDisplayProps) {
    const { classes } = useStyles()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    function handleCloseContext() {
        dispatch(popContext())
        navigate(returnUrl)
    }

    return (
        <div className={classes.wrapper}>
            <Paper elevation={0} className={classes.display}>
                <Typography variant="caption">
                    <span>{label} </span>
                    {identifier && (<span>{identifier}, </span>)}
                    <span>{name}</span>
                </Typography>
            </Paper>
            <IconButton onClick={handleCloseContext} className={classes.closeButton}>
                <Close fontSize="inherit" />
            </IconButton>
        </div>
    )
}

type SupplierDisplayProps = Readonly<{
    supplier: Merchant
    returnUrl: string
}>

function SupplierDisplay({ supplier, returnUrl }: SupplierDisplayProps) {
    return (
        <LocalizedStrict id="context-display-org-unit-supplier" attrs={{ label: true }}>
            <OrgUnitDisplay
                label="Supplier:"
                name={supplier.name}
                returnUrl={returnUrl}
            />
        </LocalizedStrict>
    )
}

type MerchantDisplayProps = Readonly<{
    merchant: Merchant
    returnUrl: string
}>

function MerchantDisplay({ merchant, returnUrl }: MerchantDisplayProps) {
    return (
        <LocalizedStrict id="context-display-org-unit-merchant" attrs={{ label: true }}>
            <OrgUnitDisplay
                label="Merchant:"
                identifier={merchant.caseNumber}
                name={merchant.name}
                returnUrl={returnUrl}
            />
        </LocalizedStrict>
    )
}

type ContextDisplayProps = Readonly<{}>

export function ContextDisplay({}: ContextDisplayProps) {
    const context = useAppSelector(selectActiveContext)

    if (!context) return (
        <div></div>
    )

    switch (context.type) {
        case "supplier":
            return (
                <SupplierDisplay supplier={context.supplier} returnUrl={context.returnUrl} />
            )
        case "merchant":
            return (
                <MerchantDisplay merchant={context.merchant} returnUrl={context.returnUrl} />
            )
        default:
            throw new UnreachableCaseError(context)
    }
}

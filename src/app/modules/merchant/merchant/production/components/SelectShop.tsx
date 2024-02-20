import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Box } from '@mui/system'
import { makeStyles } from "tss-react/mui"
import { LocalizedStrict } from '../../../../localization/components/AppLocalized'
import { useAppLocalization } from '../../../../localization/components/AppLocalizationProvider'
import { Shop } from '../productionApi'
import { useState } from 'react'



type SelectShopProps = Readonly<{
    className?: string,
    variant?: 'standard' | 'outlined' | 'filled'
    shops: Shop[] | []
    setShopId: React.Dispatch<React.SetStateAction<string | undefined>>
}>



const useStyles = makeStyles()((_theme) => ({

}))


export function SelectShop({ className, shops, variant, setShopId }: SelectShopProps) {
    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()
    const [shop, setShop] = useState<string | "All">("All")

    return (
        <Box className={cx(className)}>

            <FormControl sx={{ width: "16rem", backgroundColor: "white" }} variant={variant}>

                <LocalizedStrict id="select-shop">
                    <InputLabel id="shop-picker">Shop</InputLabel>
                </LocalizedStrict>

                <Select
                    label={l10n.getString("select-shop")}
                    value={shop}
                    onChange={(e) => {
                        const value = e.target.value
                        setShop(value)
                        setShopId(value)

                    }}
                >
                    <MenuItem key={"All"} value={"All"}>{l10n.getString("select-shop-all")} </MenuItem>
                    {shops?.map((element) => {
                        return (<MenuItem key={element.id} value={element.id}>{element.name}</MenuItem>)
                    })}

                </Select>
            </FormControl>
        </Box >
    )
}

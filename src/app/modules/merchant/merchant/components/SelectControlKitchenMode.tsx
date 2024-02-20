
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme } from '@mui/material'

import { Box } from '@mui/system';
import { makeStyles } from "tss-react/mui"
import { LocalCache, StorageKey } from '../../../../shared/cache/LocalCache';
import { useAppLocalization } from '../../../localization/components/AppLocalizationProvider';
import { LocalizedEnum } from '../../../localization/components/AppLocalized';
import { ControlKitchenMode } from '../pages/ControlKitchen';





type SelectControlKitchenModeProps = Readonly<{
    setAndSaveMode: (mode: ControlKitchenMode) => void,
    className?: string,
    mode: ControlKitchenMode,
}>



const useStyles = makeStyles()((_theme) => ({
    box: {
        width: "20rem"
    },

    selector: {
        "&::after": {
            borderBottom: "0"
        },
        "&::before": {
            borderBottom: "0"
        }
    }


}))

export function SelectControlKitchenMode({ mode, setAndSaveMode, className }: SelectControlKitchenModeProps) {
    const { classes, cx } = useStyles()
    const { l10n } = useAppLocalization()

    const handleChange = (event: SelectChangeEvent) => {
        const mode = event.target.value;
        setAndSaveMode(mode as ControlKitchenMode);
    };

    return (

        <FormControl variant={"standard"} className={cx(classes.selector, className)}>
            <Select
                label="Mode"
                value={mode}
                onChange={handleChange}
                className={cx(classes.selector)}
                sx={{ color: "#2aa6db", fontSize: "0.8rem" }}
            >
                <MenuItem value={"DELIVERY_TIME"}><LocalizedEnum base="control-kitchen-mode" enumValue={"DELIVERY_TIME"}><span>{"DELIVERY_TIME"}</span></LocalizedEnum></MenuItem>
                <MenuItem value={"PURCHASE_TIME"}><LocalizedEnum base="control-kitchen-mode" enumValue={"PURCHASE_TIME"}><span>{"PURCHASE_TIME"}</span></LocalizedEnum></MenuItem>
            </Select>
        </FormControl>

    );
}

import { Box, Button, Grid, Menu, MenuItem, Select } from '@mui/material'
import { WellknownHeight } from '../../../constants/wellknown'
import { makeStyles } from 'tss-react/mui'
import { LocalizedEnum } from '../../../modules/localization/components/AppLocalized'
import { CSSProperties, useEffect, useState } from 'react'
import { Language } from "@mui/icons-material";
import { useLocaleSelect } from '../../../modules/localization/localizationHooks'

type StyleProps = Readonly<{
    color: CSSProperties["color"]
}>

type LanguageSelectorProps = Partial<StyleProps> & Readonly<{
    className?: string
}>

const useStyles = makeStyles<StyleProps>()((theme, { color }) => ({
    button: {
        color,
        padding: 0,
        backgroundColor: "transparent"
    },
    hover: {
        "&:hover": {
            backgroundColor: "transparent"
        }
    }
}))

export function LanguageSelector({ color = "white", className }: LanguageSelectorProps) {
    const { classes, cx } = useStyles({ color })

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const { supportedLocales, selectedLocale, selectLocale } = useLocaleSelect()

    function handleLocaleChange(locale: string) {
        selectLocale(locale)
        handleMenuClose()
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-controls="language-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                startIcon={<Language />}
                className={cx(classes.button, classes.hover, className)}
                disableRipple
            >
                <LocalizedEnum base="language-selector-lang" enumValue={selectedLocale}>
                    <span>{selectedLocale}</span>
                </LocalizedEnum>
            </Button>
            <Menu
                id="language-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                {supportedLocales.map((locale) => (
                    <MenuItem key={`menu-item-${locale}`} onClick={() => handleLocaleChange(locale)}>
                        <LocalizedEnum base="language-selector-lang" enumValue={locale}>
                            <span>{locale}</span>
                        </LocalizedEnum>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}

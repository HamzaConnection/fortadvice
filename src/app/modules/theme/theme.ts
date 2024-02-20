import { createTheme } from "@mui/material"
import { TailwindPalette, tailwindPalette } from "./tailwindPalette"

declare module "@mui/material/styles" {
    interface PaletteOptions {
        tailwind: TailwindPalette
    }
    interface Palette {
        tailwind: TailwindPalette
    }
}

export const theme = createTheme({
    typography: {
        subtitle1: {
            fontWeight: 500
        }
    },
    palette: {
        tailwind: tailwindPalette,
    }
})

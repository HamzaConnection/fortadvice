import { RouterProvider } from 'react-router-dom'
import { ThemeProvider, CssBaseline, IconButton } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from "@fortawesome/pro-light-svg-icons"
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SnackbarProvider, closeSnackbar } from "notistack"
import { router } from './core/router/router'
import { AppLocalizationProvider } from './modules/localization/components/AppLocalizationProvider'
import { useLogVersionBanner } from './modules/environment/components/AppVersion'
import { Provider as ReduxProvider } from "react-redux"
import { queryClient } from './core/api/queryClient'
import { store } from './modules/store/store'
import { MuiLocalizationProvider } from './modules/localization/components/MuiLocalizationProvider'
import { theme } from './modules/theme/theme'


export const App = () => {
    useLogVersionBanner()


    return (
        <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider anchorOrigin={{ horizontal: "right", vertical: "bottom" }} hideIconVariant preventDuplicate action={(key) => (
                    <IconButton onClick={() => closeSnackbar(key)}><FontAwesomeIcon icon={faClose} size="xs" color="white" /></IconButton>
                )}>
                    <AppLocalizationProvider>
                        <MuiLocalizationProvider>
                            <QueryClientProvider client={queryClient}>
                                <RouterProvider router={router} />
                                <ReactQueryDevtools initialIsOpen={false} />
                            </QueryClientProvider>
                        </MuiLocalizationProvider>
                    </AppLocalizationProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </ReduxProvider>
    )
}

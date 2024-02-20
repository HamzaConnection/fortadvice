import { configureStore } from "@reduxjs/toolkit"
import { loginReducer } from "../login/loginSlice"
import { localizationReducer } from "../localization/localizationSlice"
import { contextReducer } from "../context/contextSlice"

export const store = configureStore({
    reducer: {
        login: loginReducer,
        localization: localizationReducer,
        context: contextReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

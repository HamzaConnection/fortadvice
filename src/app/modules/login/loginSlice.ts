import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { AuthenticationUser, LoginState, LoginStatus } from "./loginTypes"
import { LocalCache } from "../../shared/cache/LocalCache"
import { SessionCache } from "../../shared/cache/SessionCache"

function getInitialState(): LoginState {
    const usernameSettings = LocalCache().getUsernameSettings()
    const loginSettings = SessionCache().getLoginSettings()

    if (loginSettings) {
        return {
            status: LoginStatus.LOGGED_IN,
            authToken: loginSettings.authToken,
            user: loginSettings.user,
        }
    } else {
        return {
            status: LoginStatus.AUTHENTICATING,
            username: usernameSettings?.username,
            rememberMe: Boolean(usernameSettings?.username),
        }
    }
}

const initialState = getInitialState()

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<{ username: string, rememberMe: boolean }>) => {
            if (state.status === LoginStatus.AUTHENTICATING) {
                if (action.payload.rememberMe) {
                    LocalCache().setUsernameSettings(action.payload.username)
                } else {
                    LocalCache().removeUsernameSettings()
                }

                state.username = action.payload.username
                state.rememberMe = action.payload.rememberMe
            }
        },
        login: (_state, action: PayloadAction<{ authToken: string, user: AuthenticationUser }>) => {
            const { authToken, user } = action.payload
            SessionCache().setLoginSettings(authToken, user)

            return {
                status: LoginStatus.LOGGED_IN,
                authToken,
                user,
            }
        },
        logout: (_state, _action: PayloadAction<void>) => {
            const usernameSettings = LocalCache().getUsernameSettings()
            SessionCache().removeLoginSettings()

            return {
                status: LoginStatus.AUTHENTICATING,
                username: usernameSettings?.username,
                rememberMe: Boolean(usernameSettings?.username),
            }
        }
    }
})

export const { setUsername, login, logout } = loginSlice.actions
export const loginReducer = loginSlice.reducer

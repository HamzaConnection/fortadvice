import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SessionCache, StorageKey } from "../../shared/cache/SessionCache"
import { AppContext, ContextState } from "./contextTypes"
import { Logger } from "../../lib/logging"
import { logout } from "../login/loginSlice"

function push(stack: AppContext[], context: AppContext) {
    stack.push(context)
}

function pop(stack: AppContext[]) {
    return stack.pop()
}

function peek(stack: AppContext[]) {
    if (stack.length === 0) return undefined
    return stack[stack.length - 1]
}

function getInitialState(): ContextState {
    const logger = new Logger("context")

    try {
        const savedContextSettings = SessionCache().getContextSettings()

        if (savedContextSettings && savedContextSettings.stack.length > 0) {
            return {
                stack: savedContextSettings.stack,
                active: peek(savedContextSettings.stack),
            }
        }
    } catch (err: unknown) {
        logger.warn("Failed to load initial state from session storage", err)
    }

    return {
        stack: [],
        active: undefined,
    }
}

const initialState = getInitialState()

const contextSlice = createSlice({
    name: "context",
    initialState,
    reducers: {
        pushContext: (state, action: PayloadAction<AppContext>) => {
            push(state.stack, action.payload)
            state.active = peek(state.stack)
            SessionCache().setContextSettings(state.stack)
        },
        popContext: (state, _action: PayloadAction<void>) => {
            pop(state.stack)
            state.active = peek(state.stack)
            SessionCache().setContextSettings(state.stack)
        },
    },
    extraReducers(builder) {
        builder.addCase(logout, (state, _action) => {
            state.stack = []
            state.active = undefined
            SessionCache().remove(StorageKey.CONTEXT)
        })
    },
})

export const { pushContext, popContext } = contextSlice.actions
export const contextReducer = contextSlice.reducer

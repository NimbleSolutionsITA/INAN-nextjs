import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {Auth} from "../../@types";

const initialState: Auth = {
    authenticated: false,
    authenticating: false,
    user: undefined
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, { payload }: PayloadAction<Partial<Auth>>) => {
            state = {...state, ...payload}
            state.user = state.user ? {
                id: state.user.id,
                email: state.user.email,
                first_name: state.user.first_name,
                last_name: state.user.last_name,
                username: state.user.username,
                registered_date: state.user.registered_date,
                avatar_url: state.user.avatar_url,
                roles: state.user.roles,
                ...payload.user
            } : payload.user
            return state
        },
        resetAuth: () => initialState
    },
})

// Action creators are generated for each case reducer function
export const { setAuth, resetAuth } = authSlice.actions

export default authSlice.reducer
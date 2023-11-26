import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {Header} from "../../@types";

const initialState: Header = {
    headerColor: '#000',
    headerColorMobile: '#000',
    bgColor: '#fff',
    open: false,
    sizeGuideOpen: false,
    height: 168,
    heightMobile: 94,
    pageTitle: null,
    isMobile: false,
    loading: false,
    shop: {
        onlyInStock: true,
    }
}

export const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setHeader: (state, { payload }: PayloadAction<Partial<Header>>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state = {...state, ...payload}
            return state
        },
        toggleOnlyInStock: (state) => {
            return {
                ...state,
                shop: {
                    ...state.shop,
                    onlyInStock: !state.shop.onlyInStock
                }
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setHeader, toggleOnlyInStock} = headerSlice.actions

export default headerSlice.reducer
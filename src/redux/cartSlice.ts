import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {CartItem} from "../../@types";
import {PayPalApplePayConfig, PayPalGooglePayConfig} from "../components/paypal/PayPalProvider";

const initialState: {
    items: CartItem[],
    applePayConfig?: PayPalApplePayConfig
    googlePayConfig?: PayPalGooglePayConfig
} = {
    items: []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartItem: (state, { payload }: PayloadAction<CartItem>) => {
            const i = state.items.findIndex((_element: CartItem) => _element.id === payload.id)
            if (i > -1) {
                if (payload.stockQuantity && state.items[i].qty < payload.stockQuantity) {
                    state.items[i].qty = state.items[i].qty + 1
                }
            }
            else
                state.items.push(payload)
            localStorage.setItem('next-cart', JSON.stringify(state))
        },
        updateCartItem: (state, { payload }: PayloadAction<{ id: number, qty: number }>) => {
            const i = state.items.findIndex((_element: CartItem) => _element.id === payload.id)
            if (i > -1) state.items[i].qty = payload.qty
            localStorage.setItem('next-cart', JSON.stringify(state))
        },
        deleteCartItem: (state, { payload }: PayloadAction<number>) => {
            state.items = state.items.filter((item: CartItem) => item.id !== payload)
            localStorage.setItem('next-cart', JSON.stringify(state))
        },
        destroyCart: (state) => {
            localStorage.setItem('next-cart', JSON.stringify(initialState))
            return initialState
        },
        initCart: (state) => {
            state = JSON.parse( localStorage.getItem( 'next-cart' ) || '{ "items": [] }' )
            return state
        },
        setApplePayConfig: (state, action) => {
            state.applePayConfig = action.payload
        },
        setGooglePayConfig: (state, action) => {
            state.googlePayConfig = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { addCartItem, updateCartItem, deleteCartItem, destroyCart, initCart, setApplePayConfig, setGooglePayConfig } = cartSlice.actions

export default cartSlice.reducer
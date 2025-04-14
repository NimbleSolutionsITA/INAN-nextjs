import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {CartItem} from "../../@types";
import {gtagAddToCart} from "../utils/helpers";

const initialState: {items: CartItem[]} = {
    items: []
}

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addWishlistItem: (state, { payload }: PayloadAction<CartItem>) => {
            const i = state.items.findIndex((_element: CartItem) => _element.id === payload.id)
            if (i > -1) state.items[i].qty = state.items[i].qty + 1
            else state.items.push(payload)
            localStorage.setItem('next-wishlist', JSON.stringify(state))
            gtagAddToCart(payload, true)
        },
        updateWishlistItem: (state, { payload }: PayloadAction<{ id: number, qty: number }>) => {
            const i = state.items.findIndex((_element: CartItem) => _element.id === payload.id)
            if (i > -1) state.items[i].qty = payload.qty
            localStorage.setItem('next-wishlist', JSON.stringify(state))
        },
        deleteWishlistItem: (state, { payload }: PayloadAction<number>) => {
            state.items = state.items.filter((item: CartItem) => item.id !== payload)
            localStorage.setItem('next-wishlist', JSON.stringify(state))
        },
        destroyWishlist: (state) => {
            localStorage.setItem('next-wishlist', JSON.stringify(initialState))
            return initialState
        },
        initWishlist: (state) => {
            state = JSON.parse( localStorage.getItem( 'next-wishlist' ) || JSON.stringify(initialState) )
            return state
        },
    },
})

// Action creators are generated for each case reducer function
export const { addWishlistItem, updateWishlistItem, deleteWishlistItem, destroyWishlist, initWishlist } = wishlistSlice.actions

export default wishlistSlice.reducer
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import headerReducer from './headerSlice'
import cartReducer from './cartSlice'
import wishlistReducer from './wishlistSlice'
import customerReducer from './customerSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        header: headerReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        customer: customerReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


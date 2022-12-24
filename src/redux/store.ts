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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
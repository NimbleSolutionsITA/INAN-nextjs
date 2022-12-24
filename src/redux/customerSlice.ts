import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {Customer} from "../../@types/woocommerce";

type CustomerType = {
    customer?: Customer
}

const initialState: CustomerType = {

}

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        setCustomer: (state, { payload }: PayloadAction<Customer>) => {
            state.customer = payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setCustomer } = customerSlice.actions

export default customerSlice.reducer
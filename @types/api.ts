import {Product} from "./woocommerce";

export type ApiResponse<Entity> = {
    success: boolean
    error?: string
} & Entity

export type GetProductsResponse = ApiResponse<{
    products: Product[]
}>
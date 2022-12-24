import { useLayoutEffect } from 'react'
import DOMPurify from 'dompurify'
import {Order} from "../../@types/woocommerce";
import {API_ORDER_ENDPOINT} from "./endpoints";

export const sanitize = ( content: string ) => {
    return typeof window !== 'undefined' ? DOMPurify.sanitize( content ) : content
}

export const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {}

export const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const formatPrice = (price: number) =>  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)



type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export const createOrder = async (order: RecursivePartial<Order>) => {
    return await fetch(API_ORDER_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(order),
        headers: [["Content-Type", 'application/json']],
    }).then(r => r.json())
}

export const updateOrder = async (order: RecursivePartial<Order>, id: number) => {
    return await fetch(`${API_ORDER_ENDPOINT}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(order),
        headers: [["Content-Type", 'application/json']],
    }).then(r => r.json())
}
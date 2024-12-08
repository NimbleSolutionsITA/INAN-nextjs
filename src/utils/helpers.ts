import { useLayoutEffect } from 'react'
import DOMPurify from 'dompurify'
import {Order} from "../../@types/woocommerce";
import {API_ORDER_ENDPOINT} from "./endpoints";
import {getCollectionProps, getLayoutProps} from "./layout";

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

export async function getCollectionStaticProps(context: {params?: {cslug?: string}}, type: "collection"|"collaboration") {
    const [
        {layoutProps},
        {collections: allCollections}
    ] = await Promise.all([
        getLayoutProps(),
        getCollectionProps()
    ]);
    const collections = allCollections.filter(c => c.acf.type === type)

    const links = collections.map(collection => ({
        id: collection.id,
        slug: collection.slug,
        name: collection.title.rendered,
        url: `/${type}/${collection.slug}`
    }))
    const slug = context.params?.cslug ?? (links && links[links.length - 1]?.slug)
    const collection = collections.find((c) => c.slug === slug)
    return collection ? {
        props: {
            layoutProps,
            collection,
            links
        },
        revalidate: 10
    } : {
        notFound: true,
    }
}

export function decodeHtmlEntities(string: string) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = string;
    return textarea.value;
}
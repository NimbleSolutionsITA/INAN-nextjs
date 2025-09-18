import { useLayoutEffect } from 'react'
import DOMPurify from 'dompurify'
import {Continent, Order} from "../../@types/woocommerce";
import {getCollectionProps, getLayoutProps} from "./layout";
import {FormFields} from "../components/paypal/usePayPalFormProvider";
import {CartItem} from "../../@types";
import {ShippingProps} from "./shop";

export const sanitize = ( content: string ) => {
    return typeof window !== 'undefined' ? DOMPurify.sanitize( content ) : content
}

export const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {}

export const regExpEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const formatPrice = (price: number) =>  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)

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

export function getOrderPayloadFromFields({billing, shipping, shipping_method, has_shipping, coupon, vat, payment_method}: FormFields, items: CartItem[]) {
    return ({
        paymentMethod: {
            paypal: "PayPal",
            card: "PayPal - Credit Card",
            applepay: "PayPal - ApplePay",
            googlepay: "PayPal  GooglePay"
        }[payment_method],
        order: {
            billing,
            shipping: has_shipping ? shipping : billing,
            line_items: items.map(c => ({
                product_id: c.id,
                quantity: c.qty,
            })),
            shipping_lines: [{
                method_id: shipping_method.id,
                total: shipping_method.cost
            }],
            coupon_lines: coupon ? [
                { code: coupon }
            ] : undefined,
            meta_data: vat ? [{
                key: 'vat',
                value: vat
            }] : []
        }
    })
}

export function getShippingMethod({countries, continents, shippingIT, shippingEU, shippingR, shippingUK, shippingW}: ShippingProps, countryCode: string) {
    // Find the country object based on the countryCode
    const country = countries.find((c) => c.code === countryCode);

    if (!country) {
        throw new Error(`${countryCode} is not a valid country code`)
    }

    const countriesEU = getCountries(continents, 'EU');
    const countriesW = [...getCountries(continents, 'A'), ...getCountries(continents, 'NA')];
    let method = shippingR

    // Check for the shipping method based on the country code
    if (countryCode === 'IT') {
        method = shippingIT;
    } else if (countryCode === 'GB') {
        method = shippingUK;
    } else if (countriesEU.some((location) => location.code === countryCode)) {
        method = shippingEU;
    } else if (countriesW.some((location) => location.code === countryCode)) {
        method = shippingW;
    }
    return {
        id: method.method_id,
        cost: method.settings.cost.value,
        name: method.settings.title.value,
    }
}

const getCountries = (continents: Continent[], code: string) =>
    continents.find((c) => c.code === code)?.countries ?? []

export const getCartTotal = (items: CartItem[]) =>
    items.reduce((sum, i) => sum + i.qty * i.price, 0);

type EcommerceEvent = 'add_to_cart' | 'begin_checkout' | 'add_to_wishlist' | 'view_item' | 'purchase';

export const gtagEcommerceEvent = (items: CartItem[], event: EcommerceEvent) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event,
        ecommerce: {
            currency: "EUR",
            value: getCartTotal(items),
            items: items.map(item => ({
                item_id: item.id,
                item_name: item.name,
                item_variant: [item.color, item.leather, item.size].filter(Boolean).join(' - '),
                price: Number(item.price),
                quantity: item.qty
            })),
        }
    });
};

export const gtagPurchase = (order: Order) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
            currency: 'EUR',
            transaction_id: order.id.toString(),
            value: Number(order.total),
            tax: Number(order.total_tax),
            shipping: Number(order.shipping_total),
            items: order.line_items.map(item => ({
                item_id: item.product_id.toString(),
                item_name: item.name,
                item_variant: item.variation_id?.toString(),
                price: Number(item.total),
                quantity: item.quantity
            }))
        }
    });
};


export function getRelativePath(url: string) {
    // If it's already a relative path (starts with / or . or no protocol)
    if (/^(\/|\.|(?![a-zA-Z]+:))/.test(url)) {
        return url;
    }

    try {
        const urlObj = new URL(url);
        return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch (e) {
        // If URL parsing fails, return the original
        return url;
    }
}

export function splitTitleDescription(input: string): {title: string, description: string|null} {
    const parts = input.split(/\s[-–]\s/);
    if (parts.length < 2) {
        return { title: input, description: null }
    }

    const title = parts[0].trim();
    const description = parts.slice(1).join(" - ").trim();

    return { title, description };
}
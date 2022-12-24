export interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number;
    description: string;
    display: string;
    image: Image;
    menu_order: number;
    count: number;
    _links: Links;
}

export interface ProductAttribute {
    id: number;
    name: string;
    slug: string;
    description: string;
    menu_order: number;
    count: number;
    _links: Links;
}

export type Continent = {
    code: string;
    name: string;
    countries: Country[]
}

export type Country = {
    code: string;
    currency_code: string;
    currency_pos: string;
    decimal_sep: string;
    dimension_unit: string;
    name: string;
    num_decimal: string;
    states: State[];
    thousand_sep: string;
    weight_unit: string;
}

export type ShippingLocation = {
    code: string;
    type: string;
}

export type ShippingMethod = {
    enabled: boolean
    id: number
    instance_id: number
    method_description: string
    method_id: string
    method_title: string
    order: number
    settings: {
        class_cost_29: ShippingSetting
        class_cost_30: ShippingSetting
        class_costs: ShippingSetting
        cost: ShippingSetting
        no_class_cost: ShippingSetting
        tax_status: ShippingSetting
        title: ShippingSetting
        type: ShippingSetting

    }
    title: string
}

export type ShippingSetting = {
    default: string
    description: string
    id: string
    label: string
    placeholder: string
    tip: string
    type: string
    value: string
    options?: {
        name?: string
        taxable?: string
        class?: string
        order?: string
    }
}



export type State = {
    code: string;
    name: string;
}

export interface Collection {
    href: string;
}

export interface Dimensions {
    length: string;
    width: string;
    height: string;
}

export interface MetaDatum {
    id: number;
    key: string;
    value: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    type: "simple" | "variable" | "grouped";
    status: string;
    featured: boolean;
    catalog_visibility: string;
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from: null;
    date_on_sale_from_gmt: null;
    date_on_sale_to: null;
    date_on_sale_to_gmt: null;
    price_html: string;
    on_sale: boolean;
    purchasable: boolean;
    total_sales: number;
    virtual: boolean;
    downloadable: boolean;
    downloads: any[];
    download_limit: number;
    download_expiry: number;
    external_url: string;
    button_text: string;
    tax_status: string;
    tax_class: string;
    manage_stock: boolean;
    stock_quantity: null;
    in_stock: boolean;
    backorders: string;
    backorders_allowed: boolean;
    backordered: boolean;
    sold_individually: boolean;
    weight: string;
    dimensions: Dimensions;
    shipping_required: boolean;
    shipping_taxable: boolean;
    shipping_class: string;
    shipping_class_id: number;
    reviews_allowed: boolean;
    average_rating: string;
    rating_count: number;
    related_ids: number[];
    upsell_ids: number[];
    cross_sell_ids: number[];
    parent_id: number;
    purchase_note: string;
    categories: Partial<Category>[];
    tags: any[];
    images: Image[];
    attributes: Attribute[];
    default_attributes: any[];
    variations: number[];
    grouped_products: any[];
    menu_order: number;
    meta_data: MetaDatum[];
    _links: Links;
}

export interface LineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: any[];
    meta_data: MetaData[];
    sku: string;
    price: number;
}
interface ShippingLine {
    id: number;
    method_title: string;
    method_id: string;
    instance_id: string;
    total: string;
    total_tax: string;
    taxes: any[];
    meta_data: any[];
}

interface Meta_Data_Line_Item {
    // built from my own object sending in, disregard if necessary!
    key: string;
    value: string;
}
interface Cart {
    // built from my own object sending in, disregard if necessary!
    payment_method: string;
    payment_method_title: string;
    billing: Billing;
    shipping: Shipping;
    line_items: Array<LineItem>;
    shipping_lines: Array<ShippingLine>;
    customer_id: number;
    meta_data: Array<Meta_Data_Line_Item>;
    set_paid: false;
}

interface Attribute {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
    option: string;
}

export interface Image {
    woocommerce_single: string | undefined;
    woocommerce_thumbnail: string;
    id: number;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    src: string;
    name: string;
    alt: string;
    position: number;
}

export interface MetaData {
    id: number;
    key: string;
    value: string;
}

export interface Up {
    href: string;
}

export interface Customer {
    id: number;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    billing: Billing;
    shipping: Shipping;
    is_paying_customer: boolean;
    avatar_url: string;
    meta_data: MetaData[];
    _links: Links;
}

export interface Order {
    id: number;
    parent_id: number;
    number: string;
    order_key: string;
    created_via: string;
    version: string;
    status: string;
    currency: string;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    prices_include_tax: boolean;
    customer_id: number;
    customer_ip_address: string;
    customer_user_agent: string;
    customer_note: string;
    billing: Billing;
    shipping: Shipping;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    date_paid?: any;
    date_paid_gmt?: any;
    date_completed?: any;
    date_completed_gmt?: any;
    cart_hash: string;
    meta_data: any[];
    line_items: LineItem[];
    tax_lines: any[];
    shipping_lines: ShippingLine[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
    set_paid?: boolean;
    _links: Links;
}

export interface Links {
    self: Self[];
    collection: Collection[];
    up: Up[];
}

export interface Billing {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
}

export interface Shipping {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
}

export interface Variation {
    id: number;
    date_created: Date;
    date_created_gmt: Date;
    date_modified: Date;
    date_modified_gmt: Date;
    description: string;
    permalink: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from?: any;
    date_on_sale_from_gmt?: any;
    date_on_sale_to?: any;
    date_on_sale_to_gmt?: any;
    on_sale: boolean;
    visible: boolean;
    purchasable: boolean;
    virtual: boolean;
    downloadable: boolean;
    downloads: any[];
    download_limit: number;
    download_expiry: number;
    tax_status: string;
    tax_class: string;
    manage_stock: boolean;
    stock_quantity?: any;
    in_stock: boolean;
    backorders: string;
    backorders_allowed: boolean;
    backordered: boolean;
    weight: string;
    dimensions: Dimensions;
    shipping_class: string;
    shipping_class_id: number;
    image: Image;
    attributes: Attribute[];
    menu_order: number;
    meta_data: MetaData[];
    _links: Links;
}

export interface Self {
    href: string;
}
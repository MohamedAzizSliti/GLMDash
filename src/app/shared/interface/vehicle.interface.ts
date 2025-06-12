import { PaginateModel } from "./core.interface";
import { Attachment } from "./attachment.interface";
import { Attribute, AttributeValue } from "./attribute.interface";

export interface VehicleModel extends PaginateModel {
    data: Vehicle[];
}

export interface Vehicle {
    id: number;
    model_id: number;
    brand_id: number;
    title: string;
    description: string;
    immatriculation: string;
    adresse: string;
    vehicle_thumbnail_id: number;
    isConnected : any;
    info_traccar : any;
    vehicle_thumbnail: Attachment;
    vehicle_galleries_id: [];
    vehicle_galleries: Attachment[];
    unit: string;
    carburant: string;
    color: string;
    speed_max: number;
    weight: number;
    price: number;
    sale_price: number;
    discount: number;
    type: string;
    coso_moy_carburant: number;
    is_sale_enable: boolean,
    sale_starts_at: string,
    sale_expired_at: string,
    sku: string;
    estimated_delivery_text: string;
    return_policy_text: string;
    safe_checkout: boolean;
    secure_checkout: boolean;
    social_share: boolean;
    encourage_order: boolean;
    encourage_view: boolean;
    is_free_shipping: boolean;
    is_featured: boolean;
    is_trending: boolean;
    is_return: boolean;
    shipping_days: number;
    status: boolean;
    meta_title: string;
    meta_description: string;
    vehicle_meta_image: Attachment;
    vehicle_meta_image_id: number;
    size_chart_image : any;
    related_vehicles : any;
    device : any;
    driver : any;
    notifs : any[];
    stock : any;
    cross_sell_vehicles : any;
    pivot?: PivotProduct;
    created_by_id: number;
    is_approved: boolean;
    total_in_approved_vehicles: number;
    published_at: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface PivotProduct {
    order_id: number;
    vehicle_id: number;
    quantity: number;
    shipping_cost: number;
    single_price: number;
    subtotal: number;
    variation_id?: number;
    variation: Variation;
}

export interface Variation {
    id?: number;
    name: string;
    price: number;
    sale_price: number;
    stock_status: string;
    sku: string;
    discount: number;
    quantity: number;
    variation_image: Attachment;
    variation_image_id: number;
    variation_options: VariationOption[];
    attribute_values: AttributeValue[];
    status: boolean;
}

export interface VariationOption {
    name: string;
    value: string;
}

export interface Variant {
    id: number | null;
    attribute_values: number[] | null;
    options: any;
    variant_option: any;
}

export interface VariationCombination {
    name: string;
    attribute_values: number[];
}

export interface SelectedVariant {
    id: number;
    attribute_id: number;
}

export interface CustomSelect2Product {
    label :string;
    value: string | number;
    data :  ProductData;
}

export interface ProductData {
    image: string;
    name: string;
    slug: string;
    stock_status: string;
    type: string;
}

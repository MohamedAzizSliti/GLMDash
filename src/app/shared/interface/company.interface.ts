import { PaginateModel } from "./core.interface";
import { Attachment } from "./attachment.interface";
import { Country } from "./country.interface";
import { States } from "./state.interface";
import { User } from "./user.interface";

export interface CompaniesModel extends PaginateModel {
    data: Companies[];
}

export interface Companies {
    id: number;
    address: string;
    city: string;
    country: Country;
    country_id: number;
    description: string;
    hide_client_email: boolean;
    hide_client_phone: boolean;
    pincode: string;
    slug:string;
    state: States;
    state_id: number;
    status: boolean;
    total_in_approved_companies: number;
    is_approved: boolean;
    company_logo: Attachment;
    company_logo_id: number;
    school_name:string;
    client: User;
    client_id: number;
    facebook: string,
    instagram: string,
    pinterest: string,
    youtube: string,
    twitter: string,
    client_name: string;
    order_amount: number;
    orders_count: number;
    created_at?: string;
    updated_at?: string;
}

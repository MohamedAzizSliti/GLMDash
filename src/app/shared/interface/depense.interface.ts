import { PaginateModel } from "./core.interface";

export interface DepenseModel extends PaginateModel {
    data: Depense[];
}

export interface Depense {
    id: number;
    code: string;
    title: string;
    date: string;
    amount: string;
    category: string;
    vehicle_id: number;
    created_by_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}


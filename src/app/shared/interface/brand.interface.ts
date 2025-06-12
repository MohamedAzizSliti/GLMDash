import { PaginateModel } from "./core.interface";

export interface BrandModel extends PaginateModel {
    data: Brands[];
}

export interface Brands {
    id: number;
    name: string;
    features:number;
    image:string;
    created_at:string;
}

import { Attachment } from "./attachment.interface";
import { Category } from "./category.interface";
import { Tag } from "./tag.interface";

export class DashboardGpsModel {
    id: number;
    nbr_trips_last_week: string;
    fuelCost: string;
    histogramVitesse: any;
    total_vehicle: string;
    total_geofences: string;
    trips_today: string;
    nbr_company: string;
    meta_title: string;
    meta_description: string;
    blog_thumbnail: Attachment;
    blog_thumbnail_id: number;
    blog_meta_image_id: number;
    blog_meta_image: Attachment;
    categories: Category[];
    tags: Tag[];
    is_featured: boolean;
    is_sticky: boolean;
    created_by_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

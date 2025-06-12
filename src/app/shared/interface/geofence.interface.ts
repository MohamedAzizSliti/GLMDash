import { PaginateModel } from "./core.interface";

export interface GeofenceModel extends PaginateModel {
    data: Geofence[];
}

export interface Geofence {
    id: number,
    name: string,
    description: string,
    area: string,
    vehicle_id: number,
    status: boolean,
    created_by_id: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

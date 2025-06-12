import { PaginateModel } from "./core.interface";

export interface EventModel extends PaginateModel {
    data: Event[];
}

export interface Event {
    id?: number;
    deviceId: number;
    eventTime: number;
    positionId: number;
    total: number;
    geofenceId: number;
    maintenanceId: string;
    type: string;
}

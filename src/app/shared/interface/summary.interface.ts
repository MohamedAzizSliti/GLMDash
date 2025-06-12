import { PaginateModel } from "./core.interface";

export interface SummaryModel extends PaginateModel {
    data: Summary[];
}

export interface Summary {
    id?: number;
    deviceId: number;
    averageSpeed: string;
    deviceName: string;
    distance: string;
    endOdometer: string;
    endTime: string;
    engineHours: string;
    maxSpeed: string;
    total: number;
    spentFuel: string;
    startOdometer: string;
    startTime: string;
}

import { PaginateModel } from "./core.interface";

export interface TripModel extends PaginateModel {
    data: Trip[];
}

export interface Trip {
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
    startPositionId: string;
    endPositionId: string;
    startLat: string;
    startLon: string;
    endLat: string;
    endLon: string;
    startAddress: string;
    endAddress: string;
    duration: string;

}

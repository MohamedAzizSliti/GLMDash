import { Params } from "../interface/core.interface";
import { Geofence } from "../interface/geofence.interface";

export class GetGeofencees {
  static readonly type = "[Geofence] Get";
  constructor(public payload?: Params) {}
}

export class CreateGeofence {
  static readonly type = "[Geofence] Create";
  constructor(public payload: Geofence) {}
}

export class EditGeofence {
  static readonly type = "[Geofence] Edit";
  constructor(public id: number) {}
}

export class UpdateGeofence {
  static readonly type = "[Geofence] Update";
  constructor(public payload: Geofence, public id: number) {}
}

export class UpdateGeofenceStatus {
  static readonly type = "[Geofence] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class DeleteGeofence {
  static readonly type = "[Geofence] Delete";
  constructor(public id: number) {}
}

export class DeleteAllGeofence {
  static readonly type = "[Geofence] Delete All";
  constructor(public ids: number[]) {}
}

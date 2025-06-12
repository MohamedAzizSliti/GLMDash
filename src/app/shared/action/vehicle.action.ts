import { Params } from "../interface/core.interface";
import { Vehicle } from "../interface/vehicle.interface";

export class GetVehicles {
  static readonly type = "[Vehicle] Get";
  constructor(public payload?: Params) {}
}

export class CreateVehicle {
  static readonly type = "[Vehicle] Create";
  constructor(public payload: Vehicle) {}
}

export class EditVehicle {
  static readonly type = "[Vehicle] Edit";
  constructor(public id: number) {}
}

export class UpdateVehicle {
  static readonly type = "[Vehicle] Update";
  constructor(public payload: Vehicle, public id: number) {}
}

export class UpdateVehicleStatus {
  static readonly type = "[Vehicle] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class ApproveVehicleStatus {
  static readonly type = "[Vehicle] Approve Status";
  constructor(public id: number, public status: boolean) {}
}

export class DeleteVehicle {
  static readonly type = "[Vehicle] Delete";
  constructor(public id: number) {}
}

export class DeleteAllVehicle {
  static readonly type = "[Vehicle] Delete All";
  constructor(public ids: number[]) {}
}

export class ReplicateVehicle {
  static readonly type = "[Vehicle] Replicate";
  constructor(public ids: number[]) {}
}

export class ImportVehicle {
  static readonly type = "[Vehicle] Import";
  constructor(public payload: File[]) {}
}

export class ExportVehicle {
  static readonly type = "[Vehicle] Export";
}

export class SelectVehicule {
  static readonly type = '[Vehicle] SelectVehicule';
  constructor(public id: number) {}
}

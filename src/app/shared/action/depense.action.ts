import { Depense } from "../interface/depense.interface";
import { Params } from "../interface/core.interface";

export class GetDepenses {
  static readonly type = "[Depense] Get";
  constructor(public payload?: Params) {}
}

export class CreateDepense {
  static readonly type = "[Depense] Create";
  constructor(public payload: Depense) {}
}

export class EditDepense {
  static readonly type = "[Depense] Edit";
  constructor(public id: number) {}
}

export class UpdateDepense {
  static readonly type = "[Depense] Update";
  constructor(public payload: Depense, public id: number) {}
}

export class UpdateDepenseStatus {
  static readonly type = "[Depense] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class DeleteDepense {
  static readonly type = "[Depense] Delete";
  constructor(public id: number) {}
}

export class DeleteAllDepense {
  static readonly type = "[Depense] Delete All";
  constructor(public ids: number[]) {}
}

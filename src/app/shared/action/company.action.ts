import { Params } from "../interface/core.interface";
import {Companies} from '../interface/company.interface';

export class GetCompanies {
  static readonly type = "[Company] Get";
  constructor(public payload?: Params) {}
}

export class CreateCompany {
  static readonly type = "[Company] Create";
  constructor(public payload: Companies) {}
}

export class EditCompany {
  static readonly type = "[Company] Edit";
  constructor(public id: number) {}
}

export class UpdateCompany {
  static readonly type = "[Company] Update";
  constructor(public payload: Companies, public id: number) {}
}

export class UpdateCompanyStatus {
  static readonly type = "[Company] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class ApproveCompanyStatus {
  static readonly type = "[Company] Approve Status";
  constructor(public id: number, public status: boolean) {}
}

export class DeleteCompany {
  static readonly type = "[Company] Delete";
  constructor(public id: number) {}
}

export class DeleteAllCompany {
  static readonly type = "[Company] Delete All";
  constructor(public ids: number[]) {}
}

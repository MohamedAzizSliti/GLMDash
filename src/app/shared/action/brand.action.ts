import { Params } from "../interface/core.interface";

export class GetBrands {
  static readonly type = "[Brand] Get";
  constructor(public payload?: Params) {}
}


import { Params } from "../interface/core.interface";

export class GetRoutes {
  static readonly type = "[Route] Route Get";
  constructor(public payload?: Params) {}
}



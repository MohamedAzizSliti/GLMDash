import { Params } from "../interface/core.interface";

export class GetStops {
  static readonly type = "[Stop] Stop Get";
  constructor(public payload?: Params) {}
}



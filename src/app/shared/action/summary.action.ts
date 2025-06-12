import { Params } from "../interface/core.interface";

export class GetSummarys {
  static readonly type = "[Summary] Summary Get";
  constructor(public payload?: Params) {}
}



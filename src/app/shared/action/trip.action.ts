import { Params } from "../interface/core.interface";

export class GetTrips {
  static readonly type = "[Trip] Trip Get";
  constructor(public payload?: Params) {}
}
export class ExportTrips {
  static readonly type = "[Trip] Export";
  constructor(public payload?: Params) {}
}



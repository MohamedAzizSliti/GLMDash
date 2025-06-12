import { Params } from "../interface/core.interface";
import { Event } from "../interface/event.interface";

export class GetEvents {
  static readonly type = "[Event] Event Get";
  constructor(public payload?: Params) {}
}


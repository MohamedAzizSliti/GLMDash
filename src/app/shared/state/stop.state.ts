import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetStops } from "../action/stop.action";

import { StopService } from "../services/stop.service";
import { NotificationService } from "../services/notification.service";
import {Stop} from '../interface/stop.interface';

export class StopStateModel {
  stop = {
    data: [] as Stop[],
    total: 0
  }
}

@State<StopStateModel>({
  name: "stop",
  defaults: {
    stop : {
      data: [] as Stop[],
      total: 0
    }
  },
})
@Injectable()
export class StopState {

  constructor(private notificationService: NotificationService,
    private stopService: StopService) {}

  @Selector()
  static stop(state: StopStateModel) {
    return state.stop;
  }

  @Action(GetStops)
  getStops(ctx: StateContext<StopStateModel>, { payload }: GetStops) {
    return this.stopService.getStops(payload).pipe(
      tap({
        next: result => {
          console.log('/***** The Value result result ****/');
          console.log(result);
          ctx.patchState({
            stop: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }
}

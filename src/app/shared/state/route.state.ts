import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetRoutes } from "../action/route.action";

import { RouteService } from "../services/route.service";
import { NotificationService } from "../services/notification.service";
import {Route} from '../interface/route.interface';

export class RouteStateModel {
  route = {
    data: [] as Route[],
    total: 0
  }
}

@State<RouteStateModel>({
  name: "route",
  defaults: {
    route : {
      data: [] as Route[],
      total: 0
    }
  },
})
@Injectable()
export class RouteState {

  constructor(private notificationService: NotificationService,
    private routeService: RouteService) {}

  @Selector()
  static route(state: RouteStateModel) {
    return state.route;
  }

  @Action(GetRoutes)
  getRoutes(ctx: StateContext<RouteStateModel>, { payload }: GetRoutes) {
    return this.routeService.getRoutes(payload).pipe(
      tap({
        next: result => {

          ctx.patchState({
            route: {
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

import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {ExportTrips, GetTrips} from "../action/trip.action";

import { TripService } from "../services/trip.service";
import { NotificationService } from "../services/notification.service";
import {Trip} from '../interface/trip.interface';
import {ExportVehicle} from '../action/vehicle.action';
import {VehicleStateModel} from './vehicle.state';

export class TripStateModel {
  trip = {
    data: [] as Trip[],
    total: 0
  }
}

@State<TripStateModel>({
  name: "trip",
  defaults: {
    trip : {
      data: [] as Trip[],
      total: 0
    }
  },
})
@Injectable()
export class TripState {

  constructor(private notificationService: NotificationService,
    private tripService: TripService) {}

  @Selector()
  static trip(state: TripStateModel) {
    return state.trip;
  }

  @Action(GetTrips)
  getTrips(ctx: StateContext<TripStateModel>, { payload }: GetTrips) {
    return this.tripService.getTrips(payload).pipe(
      tap({
        next: result => {
          console.log('/***** The Value result result ****/');
          console.log(result);
          ctx.patchState({
            trip: {
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

  @Action(ExportTrips)
  export(ctx: StateContext<TripStateModel>, { payload } :ExportTrips) {
    return this.tripService.exportTrips(payload).pipe(
        tap({
          next: result => {
            const blob = new Blob([result], { type: 'text/xlsx' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'trips.xlsx';
            link.click();
            window.URL.revokeObjectURL(url);
          },
          error: err => {
            throw new Error(err?.error?.message);
          }
        })
    );
  }
}

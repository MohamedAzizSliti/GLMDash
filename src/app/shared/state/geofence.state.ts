import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetGeofencees, CreateGeofence, EditGeofence,
         UpdateGeofence, UpdateGeofenceStatus, DeleteGeofence,
         DeleteAllGeofence } from "../action/geofence.action";
import { Geofence } from "../interface/geofence.interface";
import { GeofenceService } from "../services/geofence.service";
import { NotificationService } from "../services/notification.service";

export class GeofenceStateModel {
  geofence = {
    data: [] as Geofence[],
    total: 0
  }
  selectedGeofence: Geofence | null;
}

@State<GeofenceStateModel>({
  name: "geofence",
  defaults: {
    geofence: {
      data: [],
      total: 0
    },
    selectedGeofence: null
  },
})
@Injectable()
export class GeofenceState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private geofenceService: GeofenceService) {}

  @Selector()
  static geofence(state: GeofenceStateModel) {
    return state.geofence;
  }

  @Selector()
  static geofencees(state: GeofenceStateModel) {
    return state.geofence.data.map((geofence: Geofence) => {
      return { label: geofence?.name, value: geofence?.id }
    });
  }

  @Selector()
  static selectedGeofence(state: GeofenceStateModel) {
    return state.selectedGeofence;
  }

  @Action(GetGeofencees)
  getGeofencees(ctx: StateContext<GeofenceStateModel>, action: GetGeofencees) {
    return this.geofenceService.getGeofencees(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            geofence: {
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

  @Action(CreateGeofence)
  create(ctx: StateContext<GeofenceStateModel>, action: CreateGeofence) {
    return this.geofenceService.createGeofence(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            geofence: {
              data: [...state.geofence.data, result],
              total: state?.geofence.total + 1
            }
          });
        },
        complete:() => {
          this.notificationService.showSuccess('Geofence Created Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditGeofence)
  edit(ctx: StateContext<GeofenceStateModel>, { id }: EditGeofence) {
    return this.geofenceService.editGeofence(id).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedGeofence: result
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateGeofence)
  update(ctx: StateContext<GeofenceStateModel>, { payload, id }: UpdateGeofence) {
    return this.geofenceService.updateGeofence(id, payload).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const geofencees = [...state.geofence.data];
            const index = geofencees.findIndex(geofence => geofence.id === id);
            geofencees[index] = result;

            ctx.patchState({
              ...state,
              geofence: {
                data: geofencees,
                total: state.geofence.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Geofence Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateGeofenceStatus)
  updateStatus(ctx: StateContext<GeofenceStateModel>, { id, status }: UpdateGeofenceStatus) {
    return this.geofenceService.updateGeofenceStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const geofencees = [...state.geofence.data];
            const index = geofencees.findIndex(geofence => geofence.id === id);
            geofencees[index] = result;

            ctx.patchState({
              ...state,
              geofence: {
                data: geofencees,
                total: state.geofence.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Geofence Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteGeofence)
  delete(ctx: StateContext<GeofenceStateModel>, { id }: DeleteGeofence) {
    return this.geofenceService.deleteGeofence(id).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetGeofencees({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Geofence Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllGeofence)
  deleteAll(ctx: StateContext<GeofenceStateModel>, { ids }: DeleteAllGeofence) {
    return this.geofenceService.deleteAllGeofence(ids).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetGeofencees({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Geofence Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }


}

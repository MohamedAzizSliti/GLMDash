import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import {
    GetVehicles, CreateVehicle, EditVehicle,
    UpdateVehicle, UpdateVehicleStatus, ApproveVehicleStatus, DeleteVehicle,
    DeleteAllVehicle, ReplicateVehicle, ExportVehicle, ImportVehicle, SelectVehicule
} from "../action/vehicle.action";
import { Vehicle, VehicleModel } from "../interface/vehicle.interface";
import { VehicleService } from "../services/vehicle.service";
import { NotificationService } from "../services/notification.service";

export class VehicleStateModel {
    vehicle = {
    data: [] as Vehicle[],
    total: 0
  }
  selectedVehicle: Vehicle | null;
  topSellingVehicles: Vehicle[]
}

@State<VehicleStateModel>({
  name: "vehicle",
  defaults: {
      vehicle: {
      data: [],
      total: 0
    },
    selectedVehicle: null,
    topSellingVehicles: []
  },
})
@Injectable()
export class VehicleState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private vehicleService: VehicleService) {}

  @Selector()
  static vehicle(state: VehicleStateModel) {
    return state.vehicle;
  }

  @Selector()
  static vehicles(state: VehicleStateModel) {
    return state.vehicle.data.map((res: Vehicle) => {
      return { label: res?.title, value: res?.id, data: {
        id:res.id,
        type: res.description,
        name: res.title,
        brand_is: res.brand_id,
        device:res.device,
        slug: res.model_id,
        stock_status: res.brand_id,
        image: res.vehicle_thumbnail ? res.vehicle_thumbnail.original_url : 'assets/images/vehicle.png'
      }}
    })
  }

  @Selector()
  static selectedVehicle(state: VehicleStateModel) {
    return state.selectedVehicle;
  }

  @Selector()
  static topSellingVehicle(state: VehicleStateModel) {
    return state.topSellingVehicles;
  }

  @Action(GetVehicles)
  getVehicles(ctx: StateContext<VehicleStateModel>, action: GetVehicles) {
    return this.vehicleService.getVehicles(action.payload).pipe(
      tap({
        next: (result: VehicleModel) => {
          if(action?.payload!['top_selling']) {
            const state = ctx.getState();
            ctx.patchState({
              ...state,
              topSellingVehicles: result.data
            });
          } else {
            ctx.patchState({
              vehicle: {
                data: result.data,
                total: result?.total ? result?.total : result.data?.length
              }
            });
          }
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

    // Action to select a vehicle by its ID
    @Action(SelectVehicule)
    selectVehicule(ctx: StateContext<VehicleStateModel>, action: SelectVehicule) {
        const state = ctx.getState();
        const selectedVehicule = state.vehicle.data.find((v) => v.id === action.id) || null;
        ctx.patchState({
            ...state,
            selectedVehicle: selectedVehicule
        });
    }

  @Action(CreateVehicle)
  create(ctx: StateContext<VehicleStateModel>, action: CreateVehicle) {

    return this.vehicleService.createVehicle(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            vehicle: {
              data: [...state.vehicle.data, result],
              total: state?.vehicle.total + 1
            }
          });
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Created Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditVehicle)
  edit(ctx: StateContext<VehicleStateModel>, { id }: EditVehicle) {
    return this.vehicleService.editVehicle(id).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedVehicle: result
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateVehicle)
  update(ctx: StateContext<VehicleStateModel>, { payload, id }: UpdateVehicle) {
    return this.vehicleService.updateVehicle(id, payload).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const vehicles = [...state.vehicle.data];
            const index = vehicles.findIndex(vehicle => vehicle.id === id);
            vehicles[index] = result;

            ctx.patchState({
              ...state,
              vehicle: {
                data: vehicles,
                total: state.vehicle.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateVehicleStatus)
  updateStatus(ctx: StateContext<VehicleStateModel>, { id, status }: UpdateVehicleStatus) {
    return this.vehicleService.updateVehicleStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const vehicles = [...state.vehicle.data];
            const index = vehicles.findIndex(vehicle => vehicle.id === id);
            vehicles[index] = result;

            ctx.patchState({
              ...state,
              vehicle: {
                data: vehicles,
                total: state.vehicle.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ApproveVehicleStatus)
  approveStatus(ctx: StateContext<VehicleStateModel>, { id, status }: ApproveVehicleStatus) {
    return this.vehicleService.approveVehicleStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const vehicles = [...state.vehicle.data];
            const index = vehicles.findIndex(vehicle => vehicle.id === id);
            vehicles[index] = result;
            ctx.patchState({
              ...state,
              vehicle: {
                data: vehicles,
                total: state.vehicle.total
              }
            });
            this.store.dispatch(new UpdateBadgeValue('/vehicle', result?.total_in_approved_vehicles));
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteVehicle)
  delete(ctx: StateContext<VehicleStateModel>, { id }: DeleteVehicle) {
    return this.vehicleService.deleteVehicle(id).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetVehicles({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllVehicle)
  deleteAll(ctx: StateContext<VehicleStateModel>, { ids }: DeleteAllVehicle) {
    return this.vehicleService.deleteAllVehicle(ids).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetVehicles({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ReplicateVehicle)
  replicateVehicle(ctx: StateContext<VehicleStateModel>, { ids }: ReplicateVehicle) {
    return this.vehicleService.replicateVehicle(ids).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetVehicles({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Vehicle Replicated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ImportVehicle)
  import(ctx: StateContext<VehicleStateModel>, action: ImportVehicle) {
    return this.vehicleService.importVehicle(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetVehicles({'page': 1, 'paginate': 15}));
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ExportVehicle)
  export(ctx: StateContext<VehicleStateModel>, action: ExportVehicle) {
    return this.vehicleService.exportVehicle().pipe(
      tap({
        next: result => {
          const blob = new Blob([result], { type: 'text/xlsx' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'vehicles.xlsx';
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

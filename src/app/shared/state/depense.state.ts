import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetDepenses, CreateDepense, EditDepense,
         UpdateDepense, UpdateDepenseStatus, DeleteDepense,
         DeleteAllDepense } from "../action/depense.action";
import { Depense } from "../interface/depense.interface";
import { DepenseService } from "../services/depense.service";
import { NotificationService } from "../services/notification.service";

export class DepenseStateModel {
  depense = {
    data: [] as Depense[],
    total: 0
  }
  selectedDepense: Depense | null;
}

@State<DepenseStateModel>({
  name: "depense",
  defaults: {
    depense: {
      data: [],
      total: 0
    },
    selectedDepense: null
  },
})
@Injectable()
export class DepenseState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private depenseService: DepenseService) {}

  @Selector()
  static depense(state: DepenseStateModel) {
    return state.depense;
  }

  @Selector()
  static currencies(state: DepenseStateModel) {
    return state.depense.data.map(res => {
      return { label: res?.code, value: res?.id }
    });
  }

  @Selector()
  static selectedDepense(state: DepenseStateModel) {
    return state.selectedDepense;
  }

  @Action(GetDepenses)
  getDepenses(ctx: StateContext<DepenseStateModel>, action: GetDepenses) {
    return this.depenseService.getDepenses(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            depense: {
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

  @Action(CreateDepense)
  create(ctx: StateContext<DepenseStateModel>, action: CreateDepense) {
    return this.depenseService.createDepense(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            depense: {
              data: [...state.depense.data, result],
              total: state?.depense.total + 1
            }
          });
        },
        complete:() => {
          this.notificationService.showSuccess('Depense Created Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditDepense)
  edit(ctx: StateContext<DepenseStateModel>, { id }: EditDepense) {
    return this.depenseService.editDepense(id).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedDepense: result
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateDepense)
  update(ctx: StateContext<DepenseStateModel>, { payload, id }: UpdateDepense) {
    return this.depenseService.updateDepense(id, payload).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const currencies = [...state.depense.data];
            const index = currencies.findIndex(depense => depense.id === id);
            currencies[index] = result;

            ctx.patchState({
              ...state,
              depense: {
                data: currencies,
                total: state.depense.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Depense Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateDepenseStatus)
  updateStatus(ctx: StateContext<DepenseStateModel>, { id, status }: UpdateDepenseStatus) {
    return this.depenseService.updateDepenseStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const currencies = [...state.depense.data];
            const index = currencies.findIndex(depense => depense.id === id);
            currencies[index] = result;

            ctx.patchState({
              ...state,
              depense: {
                data: currencies,
                total: state.depense.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Depense Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteDepense)
  delete(ctx: StateContext<DepenseStateModel>, { id }: DeleteDepense) {
    return this.depenseService.deleteDepense(id).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetDepenses({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Depense Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllDepense)
  deleteAll(ctx: StateContext<DepenseStateModel>, { ids }: DeleteAllDepense) {
    return this.depenseService.deleteAllDepense(ids).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetDepenses({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Depense Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

}

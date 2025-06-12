import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import { GetStores, CreateStore, EditStore, UpdateStore, UpdateStoreStatus, DeleteStore,
         DeleteAllStore, ApproveStoreStatus} from "../action/store.action";


import { StoreService } from "../services/store.service";
import { NotificationService } from "../services/notification.service";
import {Companies} from '../interface/company.interface';
import {CompanyService} from '../services/company.service';
import {StoreStateModel} from './store.state';
import {
    ApproveCompanyStatus,
    CreateCompany, DeleteAllCompany,
    DeleteCompany, EditCompany,
    GetCompanies, UpdateCompany,
    UpdateCompanyStatus
} from '../action/company.action';

export class CompanyStateModel {
  company = {
    data: [] as Companies[],
    total: 0
  }
  selectedCompany: Companies | null;
}

@State<CompanyStateModel>({
  name: "company",
  defaults: {
      company: {
      data: [],
      total: 0
    },
      selectedCompany: null
  },
})
@Injectable()
export class CompanyState {

  constructor(private company: Store,
    private notificationService: NotificationService,
    private companyService: CompanyService) {}

  @Selector()
  static company(state: CompanyStateModel) {
    return state.company;
  }

  @Selector()
  static companies(state: CompanyStateModel) {
    return state.company.data.map(company => {
      return { label: company?.school_name, value: company?.id }
    });
  }

  @Selector()
  static selectedCompany(state: CompanyStateModel) {
    return state.selectedCompany;
  }

  @Action(GetCompanies)
  getCompanies(ctx: StateContext<CompanyStateModel>, action: GetCompanies) {
    return this.companyService.getCompanies(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            company: {
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

  @Action(CreateCompany)
  create(ctx: StateContext<CompanyStateModel>, action: CreateCompany) {
    return this.companyService.createCompany(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            company: {
              data: [...state.company.data, result],
              total: state?.company.total + 1
            }
          });
        },
        complete:() => {
          this.notificationService.showSuccess('School Created Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditCompany)
  edit(ctx: StateContext<CompanyStateModel>, { id }: EditCompany) {
    return this.companyService.editCompany(id).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedCompany: result
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateCompany)
  update(ctx: StateContext<CompanyStateModel>, { payload, id }: UpdateCompany) {
    return this.companyService.updateCompany(id, payload).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const companies = [...state.company.data];
            const index = companies.findIndex(company => company.id === id);
            companies[index] = result;

            ctx.patchState({
              ...state,
                company: {
                data: companies,
                total: state.company.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('School Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateCompanyStatus)
  updateStatus(ctx: StateContext<CompanyStateModel>, { id, status }: UpdateCompanyStatus) {
    return this.companyService.updateCompanyStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const companies = [...state.company.data];
            const index = companies.findIndex(company => company.id === id);
              companies[index] = result;

            ctx.patchState({
              ...state,
              company: {
                data: companies,
                total: state.company.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('School Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }


  @Action(ApproveCompanyStatus)
  approveStatus(ctx: StateContext<CompanyStateModel>, { id, status }: ApproveCompanyStatus) {
    return this.companyService.approveCompanyStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const companies = [...state.company.data];
            const index = companies.findIndex(company => company.id === id);
              companies[index] = result;

            ctx.patchState({
              ...state,
              company: {
                data: companies,
                total: state.company.total
              }
            });
            this.company.dispatch(new UpdateBadgeValue('/school', result?.total_in_approved_companies));
          }
        },
        complete:() => {
          this.notificationService.showSuccess('School Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteCompany)
  delete(ctx: StateContext<CompanyStateModel>, { id }: DeleteCompany) {
    return this.companyService.deleteCompany(id).pipe(
      tap({
        next: () => {
          this.company.dispatch(new GetCompanies({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('School Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllCompany)
  deleteAll(ctx: StateContext<CompanyStateModel>, { ids }: DeleteAllCompany) {
    return this.companyService.deleteAllCompany(ids).pipe(
      tap({
        next: () => {
          const state = ctx.getState();
          let store = state.company.data.filter(value => !ids.includes(value.id));
          this.company.dispatch(new GetCompanies({'page': 1, 'paginate': 15}));
          ctx.patchState({
            ...state,
            company: {
              data: store,
              total: state.company.total - ids.length
            }
          });
        },
        complete:() => {
          this.notificationService.showSuccess('Schools Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

}

import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetStores, CreateStore, EditStore, UpdateStore, UpdateStoreStatus, DeleteStore,
         DeleteAllStore, ApproveStoreStatus} from "../action/store.action";
import { NotificationService } from "../services/notification.service";
import {Brands} from '../interface/brand.interface';
import {BrandService} from '../services/brand.service';
import {GetBrands} from '../action/brand.action';

export class BrandStateModel {
  brand = {
    data: [] as Brands[],
    total: 0
  }
  selectedBrand: Brands | null;
}

@State<BrandStateModel>({
  name: "brand",
  defaults: {
    brand: {
      data: [],
      total: 0
    },
      selectedBrand: null
  },
})
@Injectable()
export class BrandState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private brandService: BrandService) {}

  @Selector()
  static store(state: BrandStateModel) {
    return state.brand;
  }

  @Selector()
  static brands(state: BrandStateModel) {
    return state.brand.data.map(brand => {
      return { label: brand?.name, value: brand?.id }
    });
  }

  @Selector()
  static selectedStore(state: BrandStateModel) {
    return state.selectedBrand;
  }

  @Action(GetStores)
  getBrands(ctx: StateContext<BrandStateModel>, action: GetBrands) {
    return this.brandService.getBrands(null).pipe(
      tap({
        next: result => {
          ctx.patchState({
            brand: {
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

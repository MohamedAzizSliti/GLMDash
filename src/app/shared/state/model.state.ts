import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetModels } from "../action/model.action";
import { Models } from "../interface/model.interface";
import { ModelService } from "../services/model.service";

export class ModelStateModel {
  model = {
    data: [] as Models[]
  }
}

@State<ModelStateModel>({
  name: "model",
  defaults: {
    model: {
      data: []
    }
  },
})
@Injectable()
export class ModelState {

  constructor(private modelService: ModelService) {}

  @Selector()
  static state(state: ModelStateModel) {
    return state.model;
  }

  @Selector()
  static models(state: ModelStateModel) {
    return (brand_id?: number | null) => {
      if(brand_id){
        console.log('/***** The Value state.model.data ****/');
        console.log(state.model.data);
        return state.model.data.filter(element => element.brand_id == brand_id).map(st => {
          return { label: st?.name, value: st?.id, brand_id: st?.brand_id }
        });
      }
      else
        return state.model.data.map(st => {
          return { label: st?.name, value: st?.id, brand_id: st?.brand_id }
        });
    };
  }

  @Action(GetModels)
  getStates(ctx: StateContext<ModelStateModel>, action: GetModels) {
    const state = ctx.getState();
    if (state?.model?.data?.length) {
      // If the state has been already loaded
      // we just break the execution
      return true;
    }
    return this.modelService.getModels().pipe(
      tap({
        next: result => {
          ctx.patchState({
            model: {
              data: result
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

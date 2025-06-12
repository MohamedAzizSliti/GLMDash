import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetSummarys } from "../action/summary.action";

import { SummaryService } from "../services/summary.service";
import { NotificationService } from "../services/notification.service";
import {Summary} from '../interface/summary.interface';

export class SummaryStateModel {
  summary = {
    data: [] as Summary[],
    total: 0
  }
}

@State<SummaryStateModel>({
  name: "summary",
  defaults: {
    summary : {
      data: [] as Summary[],
      total: 0
    }
  },
})
@Injectable()
export class SummaryState {

  constructor(private notificationService: NotificationService,
    private summaryService: SummaryService) {}

  @Selector()
  static summary(state: SummaryStateModel) {
    return state.summary;
  }

  @Action(GetSummarys)
  getSummarys(ctx: StateContext<SummaryStateModel>, { payload }: GetSummarys) {
    return this.summaryService.getSummarys(payload).pipe(
      tap({
        next: result => {
          console.log('/***** The Value result result ****/');
          console.log(result);
          ctx.patchState({
            summary: {
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

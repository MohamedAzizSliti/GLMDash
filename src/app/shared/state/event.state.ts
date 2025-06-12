import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetEvents} from "../action/event.action";
import { EventService } from "../services/event.service";
import { NotificationService } from "../services/notification.service";
import {Event} from '../interface/event.interface';
export class EventStateModel {
  event = {
    data: [] as Event[],
    total: 0
  }
}

@State<EventStateModel>({
  name: "event",
  defaults: {
    event : {
      data: [] as Event[],
      total: 0
    }
  },
})
@Injectable()
export class EventState {

  constructor(private notificationService: NotificationService,
    private eventService: EventService) {}

  @Selector()
  static event(state: EventStateModel) {
    return state.event;
  }

  @Action(GetEvents)
  getEvents(ctx: StateContext<EventStateModel>, { payload }: GetEvents) {
    return this.eventService.getEvents(payload).pipe(
      tap({
        next: result => {
          console.log('/***** The Value result result ****/');
          console.log(result);
          ctx.patchState({
            event: {
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

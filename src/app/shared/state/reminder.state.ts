import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetReminders, GetReminderValues, CreateReminder, EditReminder,
         UpdateReminder, UpdateReminderStatus, DeleteReminder,
         DeleteAllReminder, ExportReminder, ImportAtribute } from "../action/reminder.action";
import { Reminder, ReminderValue } from "../interface/reminder.interface";
import { ReminderService } from "../services/reminder.service";
import { NotificationService } from "../services/notification.service";
import { ImportTag } from "../action/tag.action";

export class ReminderStateModel {
  reminder = {
    data: [] as Reminder[],
    total: 0
  }
  reminder_values: ReminderValue[];
  selectedReminder: Reminder | null;
}

@State<ReminderStateModel>({
  name: "reminder",
  defaults: {
    reminder: {
      data: [],
      total: 0
    },
    reminder_values: [],
    selectedReminder: null
  },
})
@Injectable()
export class ReminderState {

  constructor(private store: Store,
    private notificationService: NotificationService,
    private reminderService: ReminderService) {}

  @Selector()
  static reminder(state: ReminderStateModel) {
    return state.reminder;
  }

  @Selector()
  static reminders(state: ReminderStateModel) {
    return (ids: string) => {
      let attrIds =  Array.from(new Set(ids.split(','))).map(Number);
      let filter = attrIds.length ? state.reminder.data.filter(attr => !attrIds.includes(Number(attr.id!))) : state.reminder.data;
      return filter.map((reminder: Reminder) => {
        return { label: reminder?.name, value: reminder?.id, reminder_values: reminder?.reminder_values }
      });
    };
  }

  @Selector()
  static reminder_value(state: ReminderStateModel) {
    return (id: number | null) => {
      if(!id) return [];
      return state?.reminder_values.filter(attr_val => +attr_val.reminder_id === id)?.map((value: ReminderValue) => {
        return { label: value?.value, value: value?.id }
      });
    };
  }

  @Selector()
  static selectedReminder(state: ReminderStateModel) {
    return state.selectedReminder;
  }

  @Action(GetReminders)
  getReminders(ctx: StateContext<ReminderStateModel>, action: GetReminders) {
    return this.reminderService.getReminders(action.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            reminder: {
              data: result.data,
              total: result?.total ? result?.total : result.data.length
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetReminderValues)
  getReminderValues(ctx: StateContext<ReminderStateModel>, action: GetReminderValues) {
    return this.reminderService.getReminderValues(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            reminder_values: result.data
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateReminder)
  create(ctx: StateContext<ReminderStateModel>, action: CreateReminder) {
    return this.reminderService.createReminder(action.payload).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            reminder: {
              data: [...state.reminder.data, result],
              total: state?.reminder.total + 1
            }
          });
        },
        complete:() => {
          this.notificationService.showSuccess('Reminder Created Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditReminder)
  edit(ctx: StateContext<ReminderStateModel>, { id }: EditReminder) {
    return this.reminderService.editReminder(id).pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          ctx.patchState({
            ...state,
            selectedReminder: result
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateReminder)
  update(ctx: StateContext<ReminderStateModel>, { payload, id }: UpdateReminder) {
    return this.reminderService.updateReminder(id, payload).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const reminders = [...state.reminder.data];
            const index = reminders.findIndex(reminder => reminder.id === id);
            reminders[index] = result;

            ctx.patchState({
              ...state,
              reminder: {
                data: reminders,
                total: state.reminder.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Reminder Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateReminderStatus)
  updateStatus(ctx: StateContext<ReminderStateModel>, { id, status }: UpdateReminderStatus) {
    return this.reminderService.updateReminderStatus(id, status).pipe(
      tap({
        next: result => {
          if(typeof result === 'object') {
            const state = ctx.getState();
            const reminders = [...state.reminder.data];
            const index = reminders.findIndex(reminder => reminder.id === id);
            reminders[index] = result;

            ctx.patchState({
              ...state,
              reminder: {
                data: reminders,
                total: state.reminder.total
              }
            });
          }
        },
        complete:() => {
          this.notificationService.showSuccess('Reminder Status Updated Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteReminder)
  delete(ctx: StateContext<ReminderStateModel>, { id }: DeleteReminder) {
    return this.reminderService.deleteReminder(id).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetReminders({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Reminder Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllReminder)
  deleteAll(ctx: StateContext<ReminderStateModel>, { ids }: DeleteAllReminder) {
    return this.reminderService.deleteAllReminder(ids).pipe(
      tap({
        next: () => {
          this.store.dispatch(new GetReminders({'page': 1, 'paginate': 15}));
        },
        complete:() => {
          this.notificationService.showSuccess('Reminder Deleted Successfully');
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ImportAtribute)
  import(ctx: StateContext<ReminderStateModel>, action: ImportTag) {
    return this.reminderService.importReminder(action.payload).pipe(
      tap({
        next: result => {
          this.store.dispatch(new GetReminders({'page': 1, 'paginate': 15}));
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ExportReminder)
  export(ctx: StateContext<ReminderStateModel>, action: ExportReminder) {
    return this.reminderService.exportReminder().pipe(
      tap({
        next: result => {
          const blob = new Blob([result], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'reminders.csv';
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

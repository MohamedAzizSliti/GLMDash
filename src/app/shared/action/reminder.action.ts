import { Params } from "../interface/core.interface";
import { Reminder } from "../interface/reminder.interface";

export class GetReminders {
  static readonly type = "[Reminder] Get";
  constructor(public payload?: Params) {}
}

export class GetReminderValues {
  static readonly type = "[Reminder] Value Get";
  constructor(public payload?: Params) {}
}

export class CreateReminder {
  static readonly type = "[Reminder] Create";
  constructor(public payload: Reminder) {}
}

export class EditReminder {
  static readonly type = "[Reminder] Edit";
  constructor(public id: number) {}
}

export class UpdateReminder {
  static readonly type = "[Reminder] Update";
  constructor(public payload: Reminder, public id: number) {}
}

export class UpdateReminderStatus {
  static readonly type = "[Reminder] Update Status";
  constructor(public id: number, public status: boolean) {}
}

export class DeleteReminder {
  static readonly type = "[Reminder] Delete";
  constructor(public id: number) {}
}

export class DeleteAllReminder {
  static readonly type = "[Reminder] Delete All";
  constructor(public ids: number[]) {}
}

export class ImportAtribute {
  static readonly type = "[Reminder] Import";
  constructor(public payload: File[]) {}
}

export class ExportReminder {
  static readonly type = "[Reminder] Export";
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Reminder, ReminderModel, ReminderValueModel } from "../interface/reminder.interface";

@Injectable({
  providedIn: "root",
})
export class ReminderService {

  constructor(private http: HttpClient) {}

  getReminders(payload?: Params): Observable<ReminderModel> {
    return this.http.get<ReminderModel>(`${environment.URL}/reminder`, { params: payload });
  }

  getReminderValues(payload?: Params): Observable<ReminderValueModel> {
    return this.http.get<ReminderValueModel>(`${environment.URL}/reminder-value`, { params: payload });
  }

  createReminder(payload: Reminder): Observable<Reminder> {
    return this.http.post<Reminder>(`${environment.URL}/reminder`, payload);
  }

  editReminder(id: number): Observable<Reminder> {
    return this.http.get<Reminder>(`${environment.URL}/reminder/${id}`);
  }

  updateReminder(id: number, payload: Reminder): Observable<Reminder> {
    return this.http.put<Reminder>(`${environment.URL}/reminder/${id}`, payload);
  }

  updateReminderStatus(id: number, status: boolean): Observable<Reminder> {
    return this.http.put<Reminder>(`${environment.URL}/reminder/${id}/${status}`, {});
  }

  deleteReminder(id: number): Observable<number> {
    return this.http.delete<number> (`${environment.URL}/reminder/${id}`);
  }

  deleteAllReminder(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/reminder/deleteAll`, { ids: ids});
  }

  importReminder(payload: File[]): Observable<Reminder[]> {
    let form = new FormData();
    if(Array.isArray(payload) && payload.length) {
      payload.forEach((element: File, index: number) => {
        form.append(`reminders`, element, element.name);
      });
    }
    return this.http.post<Reminder[]>(`${environment.URL}/reminder/csv/import`, form);
  }

  exportReminder(): Observable<Blob> {
    const requestBody = {}; // You can provide any necessary request body here
    return this.http.post<Blob>(`${environment.URL}/reminder/csv/export`, requestBody, {
      responseType: 'blob' as 'json'
    });
  }

}

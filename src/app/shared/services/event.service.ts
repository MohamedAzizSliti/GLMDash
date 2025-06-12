import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {Event, EventModel} from "../interface/event.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class EventService {

  constructor(private http: HttpClient) {}

  getEvents(payload?: Params): Observable<EventModel> {
    return this.http.get<EventModel>(`${environment.URL}/traccar/reports/events`, { params:  payload });
  }
}

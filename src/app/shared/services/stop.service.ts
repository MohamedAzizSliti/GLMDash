import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {Stop, StopModel} from "../interface/stop.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class StopService {

  constructor(private http: HttpClient) {}

  getStops(payload?: Params): Observable<StopModel> {
    return this.http.get<StopModel>(`${environment.URL}/traccar/reports/stops`, { params:  payload });
  }
}

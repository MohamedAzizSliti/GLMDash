import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {Route, RouteModel} from "../interface/route.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class RouteService {

  constructor(private http: HttpClient) {}

  getRoutes(payload?: Params): Observable<RouteModel> {
    return this.http.get<RouteModel>(`${environment.URL}/traccar/reports/route`, { params:  payload });
  }
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {Trip, TripModel} from "../interface/trip.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class TripService {

  constructor(private http: HttpClient) {}

  getTrips(payload?: Params): Observable<TripModel> {
    return this.http.get<TripModel>(`${environment.URL}/traccar/reports/trips`, { params:  payload });
  }

  exportTrips(requestBody): Observable<Blob> {

    return this.http.post<Blob>(`${environment.URL}/traccar/reports/trips`, requestBody, {
      responseType: 'blob' as 'json'
    });
  }
}

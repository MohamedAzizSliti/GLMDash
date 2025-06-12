import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Geofence, GeofenceModel } from "../interface/geofence.interface";

@Injectable({
  providedIn: "root",
})
export class GeofenceService {

  constructor(private http: HttpClient) {}

  getGeofencees(payload?: Params): Observable<GeofenceModel> {
    return this.http.get<GeofenceModel>(`${environment.URL}/traccar/geofences`, { params: payload });
  }

  createGeofence(payload: Geofence): Observable<Geofence> {
    return this.http.post<Geofence>(`${environment.URL}/traccar/geofence`, payload);
  }

  editGeofence(id: number): Observable<Geofence> {
    return this.http.get<Geofence>(`${environment.URL}/traccar/geofences/${id}`);
  }

  updateGeofence(id: number, payload: Geofence): Observable<Geofence> {
    return this.http.put<Geofence>(`${environment.URL}/traccar/geofence/${id}`, payload);
  }

  updateGeofenceStatus(id: number, status: boolean): Observable<Geofence> {
    return this.http.put<Geofence>(`${environment.URL}/traccar/geofence/${id}/${status}`, {});
  }

  deleteGeofence(id: number): Observable<number> {
    return this.http.delete<number>(`${environment.URL}/traccar/geofence/${id}`);
  }

  deleteAllGeofence(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/traccar/geofence/deleteAll`, { ids: ids });
  }

}

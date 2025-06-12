import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Vehicle, VehicleModel } from "../interface/vehicle.interface";

@Injectable({
  providedIn: "root",
})
export class VehicleService {

  constructor(private http: HttpClient) {}

  getVehicles(payload?: Params): Observable<VehicleModel> {
    return this.http.get<VehicleModel>(`${environment.URL}/vehicle`, { params: payload });
  }

  createVehicle(payload: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${environment.URL}/vehicle`, payload);
  }

  editVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${environment.URL}/vehicle/${id}`);
  }

  updateVehicle(id: number, payload: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${environment.URL}/vehicle/${id}`, payload);
  }

  updateVehicleStatus(id: number, status: boolean): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${environment.URL}/vehicle/${id}/${status}`, {});
  }

  approveVehicleStatus(id: number, status: boolean): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${environment.URL}/vehicle/approve/${id}/${status}`, {});
  }

  deleteVehicle(id: number): Observable<number> {
    return this.http.delete<number>(`${environment.URL}/vehicle/${id}`);
  }

  deleteAllVehicle(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/vehicle/deleteAll`, {ids: ids});
  }

  replicateVehicle(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/vehicle/replicate`, {ids: ids});
  }

  importVehicle(payload: File[]): Observable<Vehicle[]> {
    let form = new FormData();
    if(Array.isArray(payload) && payload.length) {
      payload.forEach((element: File, index: number) => {
        form.append(`vehicles`, element, element.name);
      });
    }
    return this.http.post<Vehicle[]>(`${environment.URL}/vehicle/csv/import`, form);
  }

  exportVehicle(): Observable<Blob> {
    const requestBody = {}; // You can provide any necessary request body here
    return this.http.post<Blob>(`${environment.URL}/vehicle/csv/export`, requestBody, {
      responseType: 'blob' as 'json'
    });
  }

}

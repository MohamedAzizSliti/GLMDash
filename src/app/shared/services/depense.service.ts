import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Depense, DepenseModel } from "../interface/depense.interface";

@Injectable({
  providedIn: "root",
})
export class DepenseService {

  constructor(private http: HttpClient) {}

  getDepenses(payload?: Params): Observable<DepenseModel> {
    return this.http.get<DepenseModel>(`${environment.URL}/depense`, { params: payload });
  }

  createDepense(payload: Depense): Observable<Depense> {
    return this.http.post<Depense>(`${environment.URL}/depense`, payload);
  }

  editDepense(id: number): Observable<Depense> {
    return this.http.get<Depense>(`${environment.URL}/depense/${id}`);
  }

  updateDepense(id: number, payload: Depense): Observable<Depense> {
    return this.http.put<Depense>(`${environment.URL}/depense/${id}`, payload);
  }

  updateDepenseStatus(id: number, status: boolean): Observable<Depense> {
    return this.http.put<Depense>(`${environment.URL}/depense/${id}/${status}`, {});
  }

  deleteDepense(id: number): Observable<number> {
    return this.http.delete<number>(`${environment.URL}/depense/${id}`);
  }

  deleteAllDepense(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/depense/deleteAll`, {ids: ids});
  }

}

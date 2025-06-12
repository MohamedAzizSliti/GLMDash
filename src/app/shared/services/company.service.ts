import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import {Companies, CompaniesModel} from '../interface/company.interface';

@Injectable({
  providedIn: "root",
})
export class CompanyService {

  constructor(private http: HttpClient) {}

  getCompanies(payload?: Params): Observable<CompaniesModel> {
    return this.http.get<CompaniesModel>(`${environment.URL}/school`, { params: payload });
  }

  createCompany(payload: Companies): Observable<Companies> {
    return this.http.post<Companies>(`${environment.URL}/school`, payload);
  }

  editCompany(id: number): Observable<Companies> {
    return this.http.get<Companies>(`${environment.URL}/school/${id}`);
  }

  updateCompany(id: number, payload: Companies): Observable<Companies> {
    return this.http.put<Companies>(`${environment.URL}/school/${id}`, payload);
  }

  updateCompanyStatus(id: number, status: boolean): Observable<Companies> {
    return this.http.put<Companies>(`${environment.URL}/school/${id}/${status}`, {});
  }

  approveCompanyStatus(id: number, status: boolean): Observable<Companies> {
    return this.http.put<Companies>(`${environment.URL}/school/approve/${id}/${status}`, {});
  }

  deleteCompany(id: number): Observable<number> {
    return this.http.delete<number>(`${environment.URL}/school/${id}`);
  }

  deleteAllCompany(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/school/deleteAll`, { ids: ids});
  }

}

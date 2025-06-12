import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Stores, StoresModel } from "../interface/store.interface";
import {BrandModel} from '../interface/brand.interface';

@Injectable({
  providedIn: "root",
})
export class ClasseService {

  constructor(private http: HttpClient) {}

  getClasses(payload?: Params): Observable<BrandModel> {
    return this.http.get<BrandModel>(`${environment.URL}/class` );
  }

  saveClass(classe:any){
    return this.http.post(`${environment.URL}/class`,classe)
  }

}

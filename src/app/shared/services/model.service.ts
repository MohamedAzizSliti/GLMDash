import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import {ModelModel, Models} from '../interface/model.interface';
import {States} from '../interface/state.interface';

@Injectable({
  providedIn: "root",
})
export class ModelService {
  constructor(private http: HttpClient) {}

  getModels(): Observable<Models[]> {
    return this.http.get<Models[]>(`${environment.URL}/models`);
  }


}

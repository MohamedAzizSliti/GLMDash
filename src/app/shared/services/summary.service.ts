import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {Summary, SummaryModel} from "../interface/summary.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class SummaryService {

  constructor(private http: HttpClient) {}

  getSummarys(payload?: Params): Observable<SummaryModel> {
    return this.http.get<SummaryModel>(`${environment.URL}/traccar/reports/summarys`, { params:  payload });
  }
}

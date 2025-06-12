import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Params } from '../interface/core.interface';
import {GoogleCloud, GoogleReCaptcha, Setting} from '../interface/setting.interface';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  reCaptchaConfig: GoogleReCaptcha;
  keyMapConfig: GoogleCloud;

  constructor(private http: HttpClient) { }

  getSettingOption(): Observable<Setting> {

    return this.http.get<Setting>(`${environment.URL}/settings`);
  }

  getBackendSettingOption(): Observable<Setting> {
    return this.http.get<Setting>(`${environment.URL}/backend/settings`);
  }

  updateSettingOption(payload: Params): Observable<Setting> {
    return this.http.put<Setting>(`${environment.URL}/settings`, payload);
  }
  
  async getReCaptchaConfig(): Promise<void> {
    const config = await this.getSettingOption().toPromise();
    this.reCaptchaConfig = config?.values?.google_reCaptcha!;
  }

  async getKeyMapConfig(): Promise<void> {
    const config = await this.getSettingOption().toPromise();
    this.keyMapConfig = config?.values?.google_cloud!;
  }

}

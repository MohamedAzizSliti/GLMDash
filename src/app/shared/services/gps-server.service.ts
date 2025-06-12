import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GpsServerService {

  private url = ''
  private username = '';
  private password = '';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const auth = btoa(`${this.username}:${this.password}`);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    });
  }


  getDevices(){
    return this.http.get(this.url+'devices',  { headers: this.getAuthHeaders() });
  }



  getInfofDevice(deviceIS){
    return this.http.get(this.url+'devices/'+deviceIS,  { headers: this.getAuthHeaders() });
  }


  /**
   *
   * @param deviceId
   * @param fromDate
   * @param toDate
   */
  getPositions(deviceId = null,fromDate = null ,toDate = null)  {
    let params = ''
    console.log('/***** The Value ****/');
    console.log(toDate);
    if(deviceId){
      params = '?deviceId='+deviceId;
    }
    if(fromDate && toDate){
      params = params +  '&from='+fromDate+'&to='+toDate;
    }
    return this.http.get(`${this.url}positions`+params, { headers: this.getAuthHeaders() });
  }

  excuteCmd(deviceId,command){
    return this.http.post(this.url+'commands/send', {
      deviceId: deviceId,
      type: command,
      attributes: {
        command: command
      }
    }, { headers: this.getAuthHeaders() });
  }


  addGeofence(data){
    return this.http.post(this.url + 'geofences',  data, { headers: this.getAuthHeaders() });
  }

  getGeofences(deviceId = null)  {
    let url = `${this.url}geofences`;

    if (deviceId){
      url+= `?deviceId=${deviceId}`;
    }
     return this.http.get(url, { headers: this.getAuthHeaders() });
  }

  getPermissions() {
    return this.http.get(`${this.url}permissions`, { headers: this.getAuthHeaders() });
  }


  // Method to get events for a specific device
  getEvents(deviceId: number,selectedTypeEvents :any, fromDate: any, toDate: any)  {
    const url = `${this.url}reports/events`;
    const headers =   this.getAuthHeaders()  ;

    const params = {
      deviceId: deviceId.toString(),
      type : selectedTypeEvents.join(','),  // Join selected types with a comma
      from: fromDate,
      to: toDate,
    };

    return this.http.get(url, { headers, params });
  }


  // Method to get events for a specific device
  getTrajets(selectedDevices: any, fromDate: any, toDate: any)  {
    let url = `${this.url}reports/trips?`;
    const headers =   this.getAuthHeaders()  ;


    const from = fromDate ? fromDate : null;
    const to = toDate ? toDate : null;


    if (selectedDevices.length > 0) {
      const deviceIds = selectedDevices.join(',');
      url += `deviceId=${deviceIds}&`;
    }

    if (from) {
      url += `from=${from}&`;
    }

    if (to) {
      url += `to=${to}`;
    }

    return this.http.get(url, { headers });

  }

  getAdresseFromLAtLng(lat,lng){
    const url = `https://cors-anywhere.herokuapp.com/${this.url}geocode?lat=${lat}&lon=${lng}`;
    return this.http.get(url, { headers: this.getAuthHeaders() });
  }


  /**
   *
   * @param deviceId
   * @param geofenceId
   */
  linkGeofenceToDevice(deviceId: number, geofenceId: number) {
    const deviceUpdate = {
      id: deviceId,
      geofences: [geofenceId],  // Array of geofence IDs
    };

    return this.http.put(`${this.url}devices/${deviceId}`, deviceUpdate, {
      headers:  this.getAuthHeaders()
    }) ;
  }

  createGeofenceRule(name: string, geofenceId: number,deviceId) {
    const rule = {
      name: name,
      condition: `deviceId = ${deviceId} AND geofenceId = ${geofenceId}`,
      action: 'alert', // Or other actions like 'notify', 'log', etc.
    };

   return   this.http.post(this.url+'rules', rule, {
      headers:  this.getAuthHeaders()
    });

  }

  /**
   * Permet de récupérer les arrêts
   * @param deviceId
   * @param fromDate
   * @param toDate
   */
  getStops(deviceId = null,fromDate = null ,toDate = null)  {
    let params = ''

    if(deviceId){
      params = '?deviceId='+deviceId;
    }
    if(fromDate && toDate){
      params = params +  '&from='+fromDate+'&to='+toDate;
    }
    return this.http.get(`${this.url}reports/stops`+params, { headers: this.getAuthHeaders() });
  }

}

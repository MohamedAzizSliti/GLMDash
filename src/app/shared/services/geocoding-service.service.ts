import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.prod';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {



  constructor(  private http: HttpClient) {}



  public   reverseGeocodeWithGoogleMaps(lat: number, lng: number) {

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=api_key_here`;

    return this.http.get(url,{});

  }

     getLocalisation(): Promise<any>{
    let laltitude:any;
    let longitude:any;
    let locationError:any;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            laltitude = position.coords.latitude;
            longitude = position.coords.longitude;
            console.log('/***** The Value  position  ****/');
            console.log(position);
            return  position ;
          },
          (error) => {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                locationError = "User denied the request for Geolocation.";
                break;
              case error.POSITION_UNAVAILABLE:
                 locationError = "Location information is unavailable.";
                break;
              case error.TIMEOUT:
                locationError = "The request to get user location timed out.";
                break;

            }
          }
      );
    } else {
      locationError = "Geolocation is not supported by this browser.";
    }

    return null;
  }


}

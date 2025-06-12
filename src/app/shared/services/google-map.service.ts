import { Injectable } from '@angular/core';
import { Select } from "@ngxs/store";
import { SettingState } from "../state/setting.state";
import { Observable, firstValueFrom } from "rxjs";
import { Values } from "../interface/setting.interface";

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {

  marker: any;
  @Select(SettingState.setting) setting$: Observable<Values>;

  constructor() { }

  async loadGoogleMap(): Promise<any> {
    const win = window as any;

    // Vérifie si Google Maps est déjà chargé
    if (win.google && win.google.maps) {
      return Promise.resolve(win.google.maps);
    }

    try {
      // Récupère les settings avec une seule émission
      const setting = await firstValueFrom(this.setting$);

      console.log('/***** The Value setting ****/');
      console.log(setting);

      if (!setting?.google_cloud?.api_key) {
        return Promise.reject('Google Maps API key is missing.');
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${setting.google_cloud.api_key}&callback=initGoogleMaps&libraries=drawing,geometry,places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (win.google && win.google.maps) {
            resolve(win.google.maps);
          } else {
            reject('Google Maps SDK Not Available');
          }
        };

        script.onerror = () => reject('Failed to load Google Maps script.');

        document.body.appendChild(script);
      });

    } catch (error) {
      console.error('Error loading settings:', error);
      return Promise.reject('Failed to retrieve settings.');
    }
  }
}

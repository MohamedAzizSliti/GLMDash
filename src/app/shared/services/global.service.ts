import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Stores, StoresModel } from "../interface/store.interface";
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: "root",
})
export class GlobalService {

  constructor(private http: HttpClient) {}
  parsePolygonArea(area: string): google.maps.LatLngLiteral[] {
    // Example parsing for polygons
    // For simplicity, assuming a format like POLYGON ((lng1 lat1, lng2 lat2, ...))
    const match = area.match(/POLYGON \(\(([^)]+)\)\)/);
    if (match) {
      return match[1].split(',').map(point => {
        const [lat,lng] = point.trim().split(' ').map(Number);
        return {lng: lng, lat: lat };
      });
    }
    return [];
  }

  parseCircleArea(area: string) : { center: { lat: number; lng: number }, radius: number } {
    // Enlever "CIRCLE(" et ")"
    const circleData = area.replace('CIRCLE (', '').replace(')', '');
    // Séparer les coordonnées et le rayon
    const [coordinates, radius] = circleData.split(', ');

    const [lat,lng ] = coordinates.split(' ').map(Number); // Longitude puis latitude
    return {
      center: {lng , lat },
      radius: Number(radius)
    };
  }

  getAddress(lat: number, lng: number) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        return results[0].formatted_address;
      } else {
        return 'Address not found';
      }
    });
  }

}

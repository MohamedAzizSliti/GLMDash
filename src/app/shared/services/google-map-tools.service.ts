import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapTools {
  win : any;
   constructor() {
     this.win = window as any
  }

  async initMap(mapElement: HTMLElement, options: any): Promise<any> {
     return new  this.win.google.maps.Map(mapElement, options);
  }

  drawPath(map: any, pathCoordinates: any[]) {
    let  polylineOptions: google.maps.PolylineOptions = {
      path: pathCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      icons: []
    };


    polylineOptions.icons =   this.addDynamicArrows(pathCoordinates);

    const path = new google.maps.Polyline(polylineOptions);
    path.setMap(map);

    return path;
  }

  addDynamicArrows(path) {
    const icons = [];
    const spacing = 10; // Nombre de segments à sauter entre chaque flèche
    for (let i = 0; i < path.length - 1; i += spacing) {
      const start = path[i];
      const end = path[i + 1];
      const angle = this.calculateAngle(start, end);

      icons.push({
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3,
          strokeColor: '#0014ff',
        },
        offset: `${(i  / path.length) * 100}%`,
        rotation: angle,
      });
    }
    return icons
  }

  calculateAngle(start: google.maps.LatLngLiteral, end: google.maps.LatLngLiteral): number {
    const deltaY = end.lat - start.lat;
    const deltaX = end.lng - start.lng;
    return (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  }


  async getAddressFromLatLng(lat: number, lng: number): Promise<any> {
    const geocoder = new this.win.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve('Address not available');
        }
      });
    });
  }
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../../shared/shared.module";
import {NgxsModule} from '@ngxs/store';
import { GoogleMapsModule } from '@angular/google-maps';
// States
import {GeofenceComponent} from './geofence.component';
import {CreateGeofenceComponent} from './create-geofence/create-geofence.component';
import {EditGeofenceComponent} from './edit-geofence/edit-geofence.component';
import {GeofenceRoutingModule} from './geofence-routing.module';
import {VehicleState} from '../../shared/state/vehicle.state';
import {FormGeofenceComponent} from './form-geofencer/form-geofence.component';
import {GeofenceState} from '../../shared/state/geofence.state';

@NgModule({
    declarations: [
        GeofenceComponent,
        CreateGeofenceComponent,
        EditGeofenceComponent,
        FormGeofenceComponent
    ],
    imports: [
        CommonModule,
        GoogleMapsModule,
        GeofenceRoutingModule,
        SharedModule,
        NgxsModule.forFeature([GeofenceState, VehicleState])
    ]
})
export class GeofenceModule {
}

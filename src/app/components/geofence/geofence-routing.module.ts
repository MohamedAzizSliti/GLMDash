import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';
import {GeofenceComponent} from './geofence.component';
import {CreateGeofenceComponent} from './create-geofence/create-geofence.component';
import {EditGeofenceComponent} from './edit-geofence/edit-geofence.component';

const routes: Routes = [
  {
    path: "",
    component: GeofenceComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'geofence.index'
    }
  },
  {
    path: "create",
    component: CreateGeofenceComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ['geofence.index', 'geofence.create']
    }
  },
  {
    path: "edit/:id",
    component: EditGeofenceComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ['geofence.index', 'geofence.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeofenceRoutingModule { }

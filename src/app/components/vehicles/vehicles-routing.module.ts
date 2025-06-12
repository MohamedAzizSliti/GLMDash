import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';
import {VehiclesComponent} from './vehicles.component';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {EditVehicleComponent} from './edit-vehicle/edit-vehicle.component';

const routes: Routes = [
  {
    path: "",
    component: VehiclesComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'vehicle.index'
    }
  },
  {
    path: "create",
    component: CreateVehicleComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ['vehicle.index', 'vehicle.create']
    }
  },
  {
    path: "edit/:id",
    component: EditVehicleComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ['vehicle.index', 'vehicle.edit']
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehiclesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';
import {ClassComponent} from "./class.component";
import {CreateClassComponent} from "./create-class/create-class.component";
import {EditClassComponent} from "./edit-class/edit-class.component";

const routes: Routes = [
  {
    path: "",
    component: ClassComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'tax.index'
    }
  },
  {
    path: "create",
    component: CreateClassComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['tax.index', 'tax.create']
    }
  },
  {
    path: "edit/:id",
    component: EditClassComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['tax.index', 'tax.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Permission Guard
import {SchoolComponent} from "./school.component";
import {CreateSchoolComponent} from "./create-school/create-school.component";
import {EditSchoolComponent} from "./edit-school/edit-school.component";
import {PermissionGuard} from "../../core/guard/permission.guard";


const routes: Routes = [
  {
    path: "",
    component: SchoolComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'store.index'
    }
  },
  {
    path: "create",
    component: CreateSchoolComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ['store.index', 'store.create']
    }
  },
  {
    path: "edit/:id",
    component: EditSchoolComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: ['store.index', 'store.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }

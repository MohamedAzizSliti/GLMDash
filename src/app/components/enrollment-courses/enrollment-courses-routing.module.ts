import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';
import {EnrollmentCoursesComponent} from "./enrollment-courses.component";

const routes: Routes = [
  {
    path: "",
    component: EnrollmentCoursesComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'tax.index'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollmentCoursesRoutingModule { }

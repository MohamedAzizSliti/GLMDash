import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from "../../shared/shared.module";


import {EnrollmentCoursesComponent} from "./enrollment-courses.component";
import {EnrollmentCoursesRoutingModule} from "./enrollment-courses-routing.module";

@NgModule({
  declarations: [
    EnrollmentCoursesComponent
   ],
  imports: [
    CommonModule,
    EnrollmentCoursesRoutingModule,
    SharedModule,
  ]
})
export class EnrollmentCoursesModule { }

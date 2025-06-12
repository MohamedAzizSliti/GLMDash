import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamManagementRoutingModule } from './exam-management-routing.module';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
      SharedModule,
    ExamManagementRoutingModule
  ]
})
export class ExamManagementModule { }

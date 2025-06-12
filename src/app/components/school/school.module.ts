import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";

import {CompanyState} from '../../shared/state/company.state';
import {SchoolRoutingModule} from "./school-routing.module";
import {CreateSchoolComponent} from "./create-school/create-school.component";
import {EditSchoolComponent} from "./edit-school/edit-school.component";
import {FormSchoolComponent} from "./form-school/form-school.component";
import {SchoolComponent} from "./school.component";

@NgModule({
  declarations: [
    CreateSchoolComponent,
    SchoolComponent,
    EditSchoolComponent,
    FormSchoolComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      CompanyState
    ])
  ]
})
export class SchoolModule { }

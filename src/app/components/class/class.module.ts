import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";

// State
import { TaxState } from '../../shared/state/tax.state';
import {ClassComponent} from "./class.component";
import {EditClassComponent} from "./edit-class/edit-class.component";
import {CreateClassComponent} from "./create-class/create-class.component";
import {FormClassComponent} from "./form-class/form-class.component";
import {ClassRoutingModule} from "./class-routing.module";

@NgModule({
  declarations: [
    ClassComponent,
    EditClassComponent,
    CreateClassComponent,
    FormClassComponent
  ],
  imports: [
    CommonModule,
    ClassRoutingModule,
    SharedModule,
    NgxsModule.forFeature([TaxState])
  ]
})
export class ClassModule { }

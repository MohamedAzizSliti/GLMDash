import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamRoutingModule } from './exam-routing.module';
import {SharedModule} from "../../../shared/shared.module";
import {SelectCourseComponent} from "./select-course/select-course.component";
import {RouterModule} from "@angular/router";
import {NgxsModule} from "@ngxs/store";
import {ProductState} from "../../../shared/state/product.state";
import {StoreState} from "../../../shared/state/store.state";
import {AttributeState} from "../../../shared/state/attribute.state";
import {CategoryState} from "../../../shared/state/category.state";
import {TagState} from "../../../shared/state/tag.state";
import {TaxState} from "../../../shared/state/tax.state";
import {SettingState} from "../../../shared/state/setting.state";

@NgModule({
  declarations: [SelectCourseComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ExamRoutingModule,
    NgxsModule.forFeature([
      ProductState
    ])
  ]
})
export class ExamModule { }

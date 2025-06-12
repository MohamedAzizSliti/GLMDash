import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {SelectCourseComponent} from "./select-course/select-course.component";
import {RouterModule} from "@angular/router";
import {NgxsModule} from "@ngxs/store";
import {SharedModule} from "../../shared/shared.module";
import {ChapterRoutingModule} from "./chapter-routing.module";
import {ProductState} from "../../shared/state/product.state";


@NgModule({
  declarations: [SelectCourseComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ChapterRoutingModule,
    NgxsModule.forFeature([
      ProductState
    ])
  ]
})
export class ChapterModule { }

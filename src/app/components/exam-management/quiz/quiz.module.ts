import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from "../../../shared/shared.module";
import {SelectCourseComponent} from "./select-course/select-course.component";
import {RouterModule} from "@angular/router";
import {NgxsModule} from "@ngxs/store";
import {ProductState} from "../../../shared/state/product.state";
import {QuizRoutingModule} from "./quiz-routing.module";

@NgModule({
  declarations: [SelectCourseComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    QuizRoutingModule,
    NgxsModule.forFeature([
      ProductState
    ])
  ]
})
export class QuizModule{ }

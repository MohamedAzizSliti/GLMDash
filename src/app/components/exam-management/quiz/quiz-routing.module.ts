import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PermissionGuard} from "../../../core/guard/permission.guard";
import {SelectCourseComponent} from "./select-course/select-course.component";
import {ListQuizsComponent} from "./list-quizs/list-quizs.component";
import {CreateQuizComponent} from "./create-quiz/create-quiz.component";
import {EditQuizComponent} from "./edit-quiz/edit-quiz.component";
const routes: Routes = [
  {
    path: "select-course",
    component: SelectCourseComponent,
  },
  {
    path: "list/:id",
    component: ListQuizsComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'currency.index'
    }
  },
  {
    path: "create",
    component: CreateQuizComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'currency.index'
    }
  },
  {
    path: "edit/:id",
    component: EditQuizComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }

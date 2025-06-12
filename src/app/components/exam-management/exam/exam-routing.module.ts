import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PermissionGuard} from "../../../core/guard/permission.guard";
import {SelectCourseComponent} from "./select-course/select-course.component";
import {ListExamsComponent} from "./list-exams/list-exams.component";
import {CreateExamComponent} from "./create-exam/create-exam.component";
import {EditExamComponent} from "./edit-exam/edit-exam.component";

const routes: Routes = [
  {
    path: "select-course",
    component: SelectCourseComponent,
  },
  {
    path: "list/:id",
    component: ListExamsComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'currency.index'
    }
  },
  {
    path: "create",
    component: CreateExamComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'currency.index'
    }
  },
  {
    path: "edit/:id",
    component: EditExamComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamRoutingModule { }

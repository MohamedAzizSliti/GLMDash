import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {SelectCourseComponent} from "./select-course/select-course.component";
import {ListChaptersComponent} from "./list-chapters/list-chapters.component";
import {PermissionGuard} from "../../core/guard/permission.guard";
import {CreateChapterComponent} from "./create-chapter/create-chapter.component";
import {EditChapterComponent} from "./edit-chapter/edit-chapter.component";


const routes: Routes = [
  {
    path: "",
    redirectTo: 'select-course',
    pathMatch: "full"
  },
  {
    path: "select-course",
    component: SelectCourseComponent,
  },
  {
    path: "list/:id",
    component: ListChaptersComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'currency.index'
    }
  },
  {
    path: "create",
    component: CreateChapterComponent,
    canActivate: [PermissionGuard],
    data: {
      permission: 'currency.index'
    }
  },
  {
    path: "edit/:id",
    component: EditChapterComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChapterRoutingModule { }

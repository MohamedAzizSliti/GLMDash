import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "exam",
    loadChildren: () => import("../../components/exam-management/exam/exam.module").then((m) => m.ExamModule),
  },
  {
    path: "quiz",
    loadChildren: () => import("../../components/exam-management/quiz/quiz.module").then((m) => m.QuizModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamManagementRoutingModule { }

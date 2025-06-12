import { Component } from '@angular/core';
import {SharedModule} from "../../../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {FormQuizComponent} from "../form-quiz/form-quiz.component";

@Component({
  selector: 'app-create-quiz',
  standalone: true,
    imports: [
        SharedModule,
        CommonModule,
        FormQuizComponent
    ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss'
})
export class CreateQuizComponent {

   constructor(
   ) {

   }

}

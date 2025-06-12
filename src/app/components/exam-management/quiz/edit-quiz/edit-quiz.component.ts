import { Component } from '@angular/core';
 import {SharedModule} from "../../../../shared/shared.module";
import {FormQuizComponent} from "../form-quiz/form-quiz.component";

@Component({
  selector: 'app-edit-quiz',
  standalone: true,
  imports: [
    FormQuizComponent,
    SharedModule
  ],
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.scss'
})
export class EditQuizComponent {

}

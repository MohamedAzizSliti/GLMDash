import { Component } from '@angular/core';
import {FormExamComponent} from "../form-exam/form-exam.component";
import {SharedModule} from "../../../../shared/shared.module";

@Component({
  selector: 'app-edit-exam',
  standalone: true,
  imports: [
    FormExamComponent,
    SharedModule
  ],
  templateUrl: './edit-exam.component.html',
  styleUrl: './edit-exam.component.scss'
})
export class EditExamComponent {

}

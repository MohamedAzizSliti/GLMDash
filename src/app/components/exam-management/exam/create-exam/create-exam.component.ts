import { Component } from '@angular/core';
import {SharedModule} from "../../../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {FormExamComponent} from "../form-exam/form-exam.component";

@Component({
  selector: 'app-create-exam',
  standalone: true,
    imports: [
        SharedModule,
        CommonModule,
        FormExamComponent
    ],
  templateUrl: './create-exam.component.html',
  styleUrl: './create-exam.component.scss'
})
export class CreateExamComponent {

   constructor(
   ) {

   }

}

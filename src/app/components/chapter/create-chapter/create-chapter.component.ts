import { Component } from '@angular/core';
 import {CommonModule} from "@angular/common";
 import {SharedModule} from "../../../shared/shared.module";
import {FormChapter} from "../form-chapter/form-chapter.component";

@Component({
  selector: 'app-create-chapter',
  standalone: true,
    imports: [
        SharedModule,
        CommonModule,
        FormChapter
    ],
  templateUrl: './create-chapter.component.html',
  styleUrl: './create-chapter.component.scss'
})
export class CreateChapterComponent {

   constructor(
   ) {

   }

}

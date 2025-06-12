import { Component } from '@angular/core';
 import {SharedModule} from "../../../shared/shared.module";
import {FormChapter} from "../form-chapter/form-chapter.component";

@Component({
  selector: 'app-edit-chapter',
  standalone: true,
  imports: [
    FormChapter,
    SharedModule
  ],
  templateUrl: './edit-chapter.component.html',
  styleUrl: './edit-chapter.component.scss'
})
export class EditChapterComponent {

}

import { Component } from '@angular/core';

import {Editor, NgxEditorModule} from "ngx-editor";
import {CourseModel, DescriptionCourse} from "../../../_models/course.model";
import {AccessDataService} from "../../../shared/services/access-data.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Category} from "../../../shared/interface/category.interface";


@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.scss'
})
export class CreateCourseComponent {

}

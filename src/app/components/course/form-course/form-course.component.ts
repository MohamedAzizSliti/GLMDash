import {Component, Input} from '@angular/core';

import {Editor, NgxEditorModule} from "ngx-editor";

import {CourseModel, DescriptionCourse} from "../../../_models/course.model";
import {Category} from "../../../shared/interface/category.interface";
import {AccessDataService} from "../../../shared/services/access-data.service";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "../../../shared/services/notification.service";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-form-course',
  templateUrl: './form-course.component.html',
  styleUrl: './form-course.component.scss'
})
export class FormCourseComponent {
    public editor: Editor;
    public html = '';
    public course : CourseModel = new CourseModel();
    public formData : FormData = new FormData();
    public categories : Category[] = [];
    server: string;
    public teachers :any[] = [];
    @Input()
    type:any = 'create';
    constructor(private accesseDataService : AccessDataService,
                private http: HttpClient,
                private router: Router,
                private route:ActivatedRoute,
                private notify : NotificationService) {
        this.server = environment.URL;
    }
    ngOnInit(){
        this.editor = new Editor();
        this.addDescription()
        this.loadCats();
        this.createCourse();

        this.route.params
            .subscribe((params:any) => {
                if (params.id){
                    this.accesseDataService.getData(null,'/course/'+params.id).subscribe(
                        (response: any) => {

                            this.course = response.data;
                            this.course.description = this.course.description;
                            const imgEl = document.getElementById('courseImagePreview') as HTMLImageElement;
                            if (imgEl && this.course.media_path?.original_url) {
                                imgEl.src = this.course.media_path.original_url;
                            }
                            const imgElVideo = document.getElementById('courseVideoPreview') as HTMLImageElement;
                            if (imgElVideo && this.course.video_path?.original_url) {
                                imgElVideo.src = this.course.video_path.original_url;
                            }
                        },
                        error => {
                        },
                        () => {
                        }
                    );
                }else{

                }

            });
    }
    loadCats(){
        this.accesseDataService.getData(null,'/category').subscribe(
            (response: any) => {
                this.categories = response.data;

            },
            error => {
            },
            () => {
            }
        )
    }

    createCourse(){
        this.accesseDataService.getData(null,'/create-course').subscribe(
            (response: any) => {
                this.teachers = response.data.teachers
            },
            error => {
            },
            () => {
            }
        )
    }

    addDescription(){
        this.course.description.push(new DescriptionCourse());
    }

    saveCourse(){
        const formData = new FormData();
        formData.append('title', this.course.title);
        formData.append('description', JSON.stringify(this.course.description));
        formData.append('category_id',  this.course.category_id.toString());
        formData.append('price',  this.course.price.toString());
        formData.append('regular_price',  this.course.regular_price.toString());
        formData.append('is_active',  this.course.is_active.toString());
        formData.append('instructor_id',  this.course.instructor_id.toString());
        if (this.course.media)
            formData.append('media', this.course.media);
        if (this.course.video)
            formData.append('video', this.course.video);
        if (this.type == 'create'){
            this.http.post(this.server + '/course', formData).subscribe(response => {
                this.notify.showSuccess('Le cour a été créé avec succès');
                this.router.navigateByUrl('/course');
            });
        }else{
            this.http.post(this.server + '/update-course/'+this.course.id, formData).subscribe(response => {
                this.notify.showSuccess('Le cour a été modifié avec succès');
                this.router.navigateByUrl('/course');
            });
        }
    }

    onFileSelected(event: Event,attribut = 'media') {

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {

            const file = input.files[0];
            this.course[attribut] = file;

            // Create image preview
            const reader = new FileReader();
            reader.onload = () => {
                //   this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }
}

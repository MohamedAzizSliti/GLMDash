import {Component, Input} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../../../shared/shared.module";
import {AccessDataService} from "../../../shared/services/access-data.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {ChapterModel, ContentModel} from "../../../_models/chapter.model";
import {content} from "../../../shared/routes/routes";
import {environment} from "../../../../environments/environment";
import {forEach} from "lodash";
import {HttpClient} from "@angular/common/http";
export class Option{
    text:string;
    is_correct:boolean;
}
export class Question{
    question_text:string;
    question_type:string ;
    options: Option[] = [];
    option_1: Option = new Option();
    option_2: Option = new Option();
    option_3: Option = new Option();
    option_4: Option = new Option();
    correct_option:string;

}
export class ExamenModel {
    id:number;
    title:string;
    duration:number;
    mark_per_question:number;
    pass_marks:number;
    course_id:number;
    questions: Question[] = [] ;
}

@Component({
    selector: 'app-form-chapter',
    standalone: true,
    imports: [
        SharedModule,
        CommonModule
    ],
    templateUrl: './form-chapter.component.html',
    styleUrl: './form-chapter.component.scss'
})
export class FormChapter {
    examen : ExamenModel = new ExamenModel();
    courses : any[];
    @Input() type: string = 'add';
    chapter: ChapterModel = new ChapterModel();
    server: string;
    constructor(
        private accessDataService:AccessDataService,
        private notifyService:NotificationService,
        private router:Router,
        private http: HttpClient,
        private route:ActivatedRoute
    ) {
        this.addContent();
        this.server = environment.URL;
    }
    ngOnInit() {
        this.getAllCourses();
        this.route.params
            .subscribe((params:any) => {
                if (params.id){
                    this.accessDataService.getData(null,'/examen/'+params.id).subscribe(
                        (response: any) => {
                            console.log('/***** The Value ****/');
                            console.log(response.exam);
                           this.examen = response.exam;

                        },
                        error => {
                        },
                        () => {
                        }
                    );
                }else{
                    this.addMcqQuestionItem();

                }

            });

        this.chapter.course_id = parseInt(localStorage.getItem('current_course').toString());
    }

    getAllCourses(){
        this.accessDataService.getData(null,'/course').subscribe(
            (response: any) => {
                this.courses = response.data;
            },
            error => {
            },
            () => {
            }
        )
    }

    addMcqQuestionItem(){
        let question = new Question();
        question.question_type = 'multiple_choice';
        this.examen.questions.push(question);
    }
    addBinaryChoiceQuestionItem(){
        let question = new Question();
        question.question_type = 'single_choice';
        question.option_1.text = 'yes';
        question.option_2.text = 'no';
        this.examen.questions.push(question);
    }
    removeQuestionItem(index:number){
        this.examen.questions.splice(index,1)
    }
    removeContentItem(index:number){
        this.chapter.contents.splice(index,1)
    }
    submit(){
        if(this.type == 'add'){
            const formData = new FormData();
            formData.append('title', this.chapter.title);
            formData.append('course_id', this.chapter.course_id.toString());
            formData.append('serial_number', this.chapter.serial_number);
            this.chapter.contents.forEach(  (item,index) => {
                formData.append('contents['+index+'][title]', item.title);
                formData.append('contents['+index+'][serial_number]', item.serial_number.toString());
                formData.append('contents['+index+'][is_free]', item.is_free.toString());
                formData.append('contents['+index+'][media]', item.media);
            });

            this.http.post(this.server + '/chapter', formData).subscribe(response => {
                this.notifyService.showSuccess('Le chapitre a été créé avec succès');
                this.router.navigateByUrl('/chapter/list/'+localStorage.getItem('current_course'));
            });
        } else{
            this.accessDataService.updateData(this.examen,'/examen/'+this.examen.id).subscribe(
                (response: any) => {
                    this.notifyService.showSuccess('Le chapitre a été modifié avec succès');
                    this.router.navigateByUrl('/chapter/list/'+this.chapter.course_id);
                },
                error => {
                },
                () => {
                }
            )
        }

    }

    addContent(){
        let content = new ContentModel();
        content.serial_number =  this.chapter.contents.length + 1;
        this.chapter.contents.push(content)
    }

    protected readonly content = content;

    onFileSelected(event: Event,i) {

        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {

            const file = input.files[0];
            this.chapter.contents[i].media = file;

            // Create image preview
            const reader = new FileReader();
            reader.onload = () => {
                //   this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }
}

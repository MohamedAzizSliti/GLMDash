import {Component, Input} from '@angular/core';
import {SharedModule} from "../../../../shared/shared.module";
import {AccessDataService} from "../../../../shared/services/access-data.service";
import {NotificationService} from "../../../../shared/services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonModule} from "@angular/common";

export class Option{
    text:string = '';
    is_correct:boolean = false;
}

export class Question{
    question_text:string = '';
    question_type:string = '';
    options: Option[] = [];
    option_1: Option = new Option();
    option_2: Option = new Option();
    option_3: Option = new Option();
    option_4: Option = new Option();
    correct_option:string = '';
}

export class ExamenModel {
    id:number;
    title:string = '';
    duration:number;
    mark_per_question:number;
    pass_marks:number;
    course_id:number;
    questions: Question[] = [];
}

@Component({
    selector: 'app-form-quiz',
    standalone: true,
    imports: [
        SharedModule,
        CommonModule
    ],
    templateUrl: './form-quiz.component.html',
    styleUrl: './form-quiz.component.scss'
})
export class FormQuizComponent {
    examen : ExamenModel = new ExamenModel();
    courses : any[] = [];
    @Input() type: string = 'add';
    errors: any = {};
    isSubmitting: boolean = false;

    constructor(
        private accessDataService:AccessDataService,
        private notifyService:NotificationService,
        private router:Router,
        private route:ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.getAllCourses();
        this.examen.course_id = parseInt(localStorage.getItem('current_course')?.toString() || '0');
        this.route.params
            .subscribe((params:any) => {
                if (params.id){
                    this.loadQuiz(params.id);
                }else{
                    this.addMcqQuestionItem();
                }
            });
    }

    loadQuiz(id: number) {
        this.accessDataService.getData(null,'/quiz/'+id).subscribe(
            (response: any) => {
                console.log('Quiz loaded:', response.exam);
                this.examen = response.exam;
                // Ensure questions have proper structure
                this.examen.questions.forEach(question => {
                    if (!question.option_1) question.option_1 = new Option();
                    if (!question.option_2) question.option_2 = new Option();
                    if (!question.option_3) question.option_3 = new Option();
                    if (!question.option_4) question.option_4 = new Option();
                });
            },
            error => {
                this.notifyService.showError('Erreur lors du chargement du quiz');
                console.error('Error loading quiz:', error);
            }
        );
    }

    getAllCourses(){
        this.accessDataService.getData(null,'/course').subscribe(
            (response: any) => {
                this.courses = response.data || [];
            },
            error => {
                console.error('Error loading courses:', error);
            }
        )
    }

    addMcqQuestionItem(){
        let question = new Question();
        question.question_type = 'multiple_choice';
        question.option_1 = new Option();
        question.option_2 = new Option();
        question.option_3 = new Option();
        question.option_4 = new Option();
        this.examen.questions.push(question);
    }

    addBinaryChoiceQuestionItem(){
        let question = new Question();
        question.question_type = 'single_choice';
        question.option_1 = new Option();
        question.option_1.text = 'Vrai';
        question.option_2 = new Option();
        question.option_2.text = 'Faux';
        question.correct_option = '';
        this.examen.questions.push(question);
    }

    removeQuestionItem(index:number){
        if (this.examen.questions.length > 1) {
            this.examen.questions.splice(index,1);
        } else {
            this.notifyService.showError('Un quiz doit contenir au moins une question');
        }
    }

    validateForm(): boolean {
        this.errors = {};
        let isValid = true;

        // Validate basic fields
        if (!this.examen.title?.trim()) {
            this.errors.title = 'Le titre est requis';
            isValid = false;
        }

        if (!this.examen.duration || this.examen.duration < 1) {
            this.errors.duration = 'La durée doit être supérieure à 0';
            isValid = false;
        }

        if (!this.examen.mark_per_question || this.examen.mark_per_question < 1) {
            this.errors.mark_per_question = 'Les points par question doivent être supérieurs à 0';
            isValid = false;
        }

        if (!this.examen.pass_marks || this.examen.pass_marks < 1) {
            this.errors.pass_marks = 'Les points de passage doivent être supérieurs à 0';
            isValid = false;
        }

        if (!this.examen.course_id) {
            this.errors.course_id = 'Veuillez sélectionner un cours';
            isValid = false;
        }

        // Validate questions
        if (!this.examen.questions || this.examen.questions.length === 0) {
            this.errors.questions = 'Au moins une question est requise';
            isValid = false;
        } else {
            this.examen.questions.forEach((question, index) => {
                if (!question.question_text?.trim()) {
                    this.errors[`question_${index}`] = 'Le texte de la question est requis';
                    isValid = false;
                }

                if (question.question_type === 'multiple_choice') {
                    // Check if at least one option has text
                    const hasOptions = question.option_1?.text?.trim() || 
                                     question.option_2?.text?.trim() || 
                                     question.option_3?.text?.trim() || 
                                     question.option_4?.text?.trim();
                    
                    if (!hasOptions) {
                        this.errors[`options_${index}`] = 'Au moins une option est requise';
                        isValid = false;
                    }

                    // Check if at least one option is marked as correct
                    const hasCorrectAnswer = question.option_1?.is_correct || 
                                           question.option_2?.is_correct || 
                                           question.option_3?.is_correct || 
                                           question.option_4?.is_correct;
                    
                    if (!hasCorrectAnswer) {
                        this.errors[`correct_${index}`] = 'Au moins une réponse correcte est requise';
                        isValid = false;
                    }
                } else if (question.question_type === 'single_choice') {
                    if (!question.correct_option) {
                        this.errors[`correct_${index}`] = 'Veuillez sélectionner la bonne réponse';
                        isValid = false;
                    }
                }
            });
        }

        return isValid;
    }

    submit(){
        if (!this.validateForm()) {
            this.notifyService.showError('Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        this.isSubmitting = true;

        if(this.type == 'add'){
            this.accessDataService.postData(this.examen,'/examen').subscribe(
                (response: any) => {
                    this.notifyService.showSuccess('Quiz ajouté avec succès');
                    this.router.navigateByUrl('/exam-management/quiz/list/'+localStorage.getItem('current_course'));
                },
                error => {
                    this.notifyService.showError('Erreur lors de l\'ajout du quiz');
                    console.error('Error creating quiz:', error);
                    this.isSubmitting = false;
                }
            )
        }else{
            this.accessDataService.updateData(this.examen,'/quiz/'+this.examen.id).subscribe(
                (response: any) => {
                    this.notifyService.showSuccess('Quiz modifié avec succès');
                    this.router.navigateByUrl('/exam-management/quiz/list/'+this.examen.course_id);
                },
                error => {
                    this.notifyService.showError('Erreur lors de la modification du quiz');
                    console.error('Error updating quiz:', error);
                    this.isSubmitting = false;
                }
            )
        }
    }

    getErrorMessage(field: string): string {
        return this.errors[field] || '';
    }

    hasError(field: string): boolean {
        return !!this.errors[field];
    }
}

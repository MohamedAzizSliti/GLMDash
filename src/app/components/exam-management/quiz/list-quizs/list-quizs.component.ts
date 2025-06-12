import {Component, ViewChild} from '@angular/core';
import {SharedModule} from "../../../../shared/shared.module";
import {Product, ProductModel} from "../../../../shared/interface/product.interface";
import {TableClickedAction, TableConfig} from "../../../../shared/interface/table.interface";
import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
import {GetProducts} from "../../../../shared/action/product.action";
import {Select, Store} from "@ngxs/store";

import {AccessDataService} from "../../../../shared/services/access-data.service";

import {NotificationService} from "../../../../shared/services/notification.service";
import {DeleteModalComponent} from "../../../../shared/components/ui/modal/delete-modal/delete-modal.component";

@Component({
  selector: 'app-list-quizs',
  standalone: true,
    imports: [
        SharedModule,
        RouterModule
    ],
  templateUrl: './list-quizs.component.html',
  styleUrl: './list-quizs.component.scss'
})
export class ListQuizsComponent {
    @ViewChild("deleteModal") DeleteModal: DeleteModalComponent;
    course:any;
    exams:any
   constructor(private store: Store,
              private accessDataService: AccessDataService,
              private route: ActivatedRoute,
              private notifyService : NotificationService,
              private router: Router) {
  }
  ngOnInit() {
    this.route.params
        .subscribe((parms:any) => {
          localStorage.setItem('current_course',parms.id);
            this.loadExams(parms.id)
        });
  }


  loadExams(id){
      this.accessDataService.getData(null,'/exams/course/'+id).subscribe(
          (response: any) => {
              this.exams = response.exams;
              this.course = response.course;
              this.tableConfig.data = this.exams;
              this.tableConfig.total = this.exams.length;
          },
          error => {
          },
          () => {
          }
      )
  }
  public tableConfig: TableConfig = {
    columns: [
      { title: "#", dataField: "id" , type: 'number' },
      { title: "Exam Title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "Total questions", dataField: "nbr_question",  sortable: true, sort_direction: 'desc' },
      { title: "Duration", dataField: "duration", sortable: true, sort_direction: 'desc' },
      { title: "Mark Per Question", dataField: "mark_per_question", sortable: true, sort_direction: 'desc' },
      { title: "Pass Marks", dataField: "pass_marks", type: 'number', sortable: true, sort_direction: 'desc' },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "coupon.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "coupon.destroy" }
    ],
    data: [] as any[],
    total: 0
  };


  onTableChange(data?: Params)  {
    this.store.dispatch(new GetProducts(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)

      if(action.actionToPerform == 'delete')
          this.delete(action.data)
  }

  edit(data: Product) {
    this.router.navigateByUrl(`/exam-management/exam/edit/${data.id}`);
  }

    delete(data: Product) {
        this.accessDataService.deleteData(null,'/examen/'+data.id).subscribe(
          (response: any) => {
              this.notifyService.showSuccess('L\' Examen a été supprimé avec succès')
              this.loadExams(this.course.id)
          },
          error => {
          },
          () => {
          }
        )
     }
}

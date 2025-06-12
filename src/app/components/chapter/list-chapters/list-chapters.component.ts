import {Component, ViewChild} from '@angular/core';
   import {ActivatedRoute, Params, Router, RouterModule} from "@angular/router";
 import {Select, Store} from "@ngxs/store";
import {DeleteModalComponent} from "../../../shared/components/ui/modal/delete-modal/delete-modal.component";
import {SharedModule} from "../../../shared/shared.module";
import {AccessDataService} from "../../../shared/services/access-data.service";
import {NotificationService} from "../../../shared/services/notification.service";
import {TableClickedAction, TableConfig} from "../../../shared/interface/table.interface";
import {Product} from "../../../shared/interface/product.interface";

@Component({
  selector: 'app-list-exams',
  standalone: true,
    imports: [
        SharedModule,
        RouterModule
    ],
  templateUrl: './list-chapters.component.html',
  styleUrl: './list-chapters.component.scss'
})
export class ListChaptersComponent {
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
      this.accessDataService.getData(null,'/chapters/course/'+id).subscribe(
          (response: any) => {
              this.exams = response.chapters;
              this.course = response.course;
              console.log('/***** The Value this.exams ****/');
              console.log(this.exams);
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
      { title: "Chapter Title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "Is free", dataField: "is_free",  sortable: true, sort_direction: 'desc' },
      { title: "Course nbr", dataField: "contents_count", sortable: true, sort_direction: 'desc' },
     ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "coupon.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "coupon.destroy" }
    ],
    data: [] as any[],
    total: 0
  };


  onTableChange(data?: Params) {
   // this.store.dispatch(new GetProducts(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)

      if(action.actionToPerform == 'delete')
          this.delete(action.data)
  }

  edit(data: Product) {
    this.router.navigateByUrl(`/chapter/edit/${data.id}`);
  }

    delete(data: Product) {
        this.accessDataService.deleteData(null,'/chapter/'+data.id).subscribe(
          (response: any) => {
              this.notifyService.showSuccess('Le chapitre a été supprimé avec succès')
              this.loadExams(this.course.id)
          },
          error => {
          },
          () => {
          }
        )
     }
}

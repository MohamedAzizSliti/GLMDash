import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Tax, TaxModel } from "../../shared/interface/tax.interface";
import { TaxState } from '../../shared/state/tax.state';
import { GetTaxes, UpdateTaxStatus, 
         DeleteTax, DeleteAllTax } from '../../shared/action/tax.action';
import {ClasseService} from "../../shared/services/classe.service";

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent {

  @Select(TaxState.tax) tax$: Observable<TaxModel>;
  classes: any;
  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "Niveau", dataField: "level", sortable: true, sort_direction: 'desc' },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "tax.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "tax.destroy" },
    ],
    data: [] as Tax[],
    total: 0
  };

  constructor(private store: Store,
    private classService:ClasseService,
    public router: Router) {
}

  ngOnInit() {
    this.classService.getClasses().subscribe(
        (classes)=>{
          this.tableConfig.data =  classes.data;
          this.tableConfig.total = classes ? classes?.total : 0;
        }
    )
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetTaxes(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Tax) {
    this.router.navigateByUrl(`/tax/edit/${data.id}`);
  }

  status(data: Tax) {
    this.store.dispatch(new UpdateTaxStatus(data.id, data.status));
  }

  delete(data: Tax) {
    this.store.dispatch(new DeleteTax(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllTax(ids));
  }

}

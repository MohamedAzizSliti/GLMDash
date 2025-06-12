import { Component } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { Params } from '../../shared/interface/core.interface';

import {CompanyState} from '../../shared/state/company.state';
import {Companies, CompaniesModel} from '../../shared/interface/company.interface';
import {ApproveCompanyStatus, DeleteAllCompany, DeleteCompany, GetCompanies} from '../../shared/action/company.action';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent {

  @Select(CompanyState.company) company$: Observable<CompaniesModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "Logo", dataField: "school_logo", class: 'tbl-logo-image', type: 'image', key: 'school_name' },
      { title: "school_name", dataField: "school_name" },
      { title: "name", dataField: "client_name" },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "approved", dataField: "is_approved", type: "switch", canAllow: ['admin'] },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "store.edit"  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "store.destroy"  },
    ],
    data: [] as Companies[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.company$.subscribe(company => {
      let companies = company?.data?.filter((element: Companies) => {
        console.log('/***** The Value  this.company$.subscribe ****/');
        console.log(element);
        element.client_name = element?.client?.name;
        return element;
      });
      this.tableConfig.data  = companies ? companies : [];
      this.tableConfig.total = company  ? company?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetCompanies(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'is_approved')
      this.approve(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Companies) {
    this.router.navigateByUrl(`/school/edit/${data.id}`);
  }

  approve(data: Companies) {
    this.store.dispatch(new ApproveCompanyStatus(data.id, data.is_approved))
  }

  delete(data: Companies) {
    this.store.dispatch(new DeleteCompany(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllCompany(ids));
  }

}

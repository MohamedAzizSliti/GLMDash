import { Component, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Geofence, GeofenceModel } from "../../shared/interface/geofence.interface";
import { GeofenceState } from '../../shared/state/geofence.state';
import { GetGeofencees, DeleteGeofence, DeleteAllGeofence } from '../../shared/action/geofence.action';
import { ImportCsvModalComponent } from "../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";


@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.scss']
})
export class GeofenceComponent {

  @Select(GeofenceState.geofence) geofence$: Observable<GeofenceModel>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;

      public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "id", type: "no" },
      { title: "Name", dataField: "name", sortable: true, sort_direction: 'desc' },
      { title: "Date", dataField: "date", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "Description", dataField: "description", sortable: true, sort_direction: 'desc' },
      { title: "Vehicle", dataField: "car.title", sortable: true, sort_direction: 'desc' },
      { title: "Is Visible", dataField: "attributes.show", sortable: true, sort_direction: 'desc' },
      { title: "User", dataField: "user.name", sortable: true, sort_direction: 'desc' },
      { title: "Area", dataField: "area", sortable: true, sort_direction: 'desc' },
     ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "geofence.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "geofence.destroy" },
    ],
    data: [] as Geofence[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.geofence$.subscribe(geofence => {
      this.tableConfig.data = geofence ? geofence?.data : [];
      this.tableConfig.total = geofence ? geofence?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetGeofencees(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Geofence) {
    this.router.navigateByUrl(`/geofence/edit/${data.id}`);
  }

  delete(data: Geofence) {
    this.store.dispatch(new DeleteGeofence(data.id!))
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllGeofence(ids))
  }

  export() {
//    this.store.dispatch(new ExportGeofence());
  }

}

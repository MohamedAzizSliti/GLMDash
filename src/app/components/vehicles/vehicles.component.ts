import { Component, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Vehicle, VehicleModel } from "../../shared/interface/vehicle.interface";
import { VehicleState } from '../../shared/state/vehicle.state';
import { GetVehicles, UpdateVehicleStatus, ApproveVehicleStatus,
         DeleteVehicle, DeleteAllVehicle, ReplicateVehicle, ExportVehicle } from '../../shared/action/vehicle.action';
import { ImportCsvModalComponent } from "../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import {VehicleService} from '../../shared/services/vehicle.service';
import {AccountState} from '../../shared/state/account.state';
import {AccountUser} from '../../shared/interface/account.interface';


@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent {

  @Select(VehicleState.vehicle) vehicle$: Observable<VehicleModel>;
  @Select(AccountState.user) user$: Observable<AccountUser>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
  vehicles : any = [];
  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "image", dataField: "vehicle_thumbnail", class: 'tbl-image', type: 'image', placeholder: 'assets/images/product.png' },
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "conducteur", dataField: "driver.name",  sortable: true, sort_direction: 'desc' },
      { title: "IMEI device", dataField: "device.imei", sortable: true, sort_direction: 'desc' },
      { title: "immatriculation", dataField: "immatriculation" },
      { title: "phone", dataField: "driver.phone" },
      { title: "status", dataField: "status", type: "switch" },
      { title: "Connected", dataField: "isConnected"},
      { title: "Current adresse", dataField: "adresse"},
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "vehicle.edit"  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "vehicle.destroy"  },
      { label: "Action", actionToPerform: "action", icon: "ri-flashlight-fill", permission: "vehicle.destroy"  }
    ],
    data: [] as Vehicle[],
    total: 0
  };
  firstCall : boolean = true;

  constructor(private store: Store,private vehicleService:VehicleService,
    private router: Router) {
    this.user$.subscribe(user => {

      if (user.role?.name !== 'vendor' && user.role?.name !== 'consumer' ){
        if (this.firstCall)
        this.tableConfig.columns?.push({ title: "Société", dataField: "user.name"});
        this.firstCall = false;
      }
    });

  }

  ngOnInit() {

    this.vehicle$.subscribe(vehicle => {
      let vehicles = vehicle?.data?.filter((element: Vehicle) => {
        console.log('/***** The Value elementelementelementelementelementelementelement****/');
        console.log(element);
        if (element){
          element.isConnected = element?.device?.info_traccar &&  element?.device?.info_traccar?.status == 'online' ? `<img class="isConnected" style="width=30px !important; "  src="assets/images/valid.png">` : '<img class="isConnected" style="width=30px !important;" src="assets/images/no-valid.png">';
          element.adresse = element?.device?.info_traccar &&  element?.device?.info_traccar?.status == 'online' ? element?.device?.info_traccar?.position.adresse   : '____________';

        }
        return element;
      });
      this.tableConfig.data = vehicle ? vehicles : [];
      this.tableConfig.total = vehicle ? vehicle?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetVehicles(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'is_approved')
      this.approve(action.data)
    else if(action.actionToPerform == 'status')
      this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'action')
      this.action(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
    else if(action.actionToPerform == 'duplicate')
      this.duplicate(action.data)
  }

  edit(data: Vehicle) {
    this.router.navigateByUrl(`/vehicle/edit/${data.id}`);
  }

  approve(data: Vehicle) {
    this.store.dispatch(new ApproveVehicleStatus(data.id, data.is_approved));
  }

  status(data: Vehicle) {
    this.store.dispatch(new UpdateVehicleStatus(data.id, data.status));
  }

  delete(data: Vehicle) {
    this.store.dispatch(new DeleteVehicle(data.id));
  }

  action(data: Vehicle) {
    this.store.dispatch(new DeleteVehicle(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllVehicle(ids));
  }

  duplicate(ids: number[]) {
    this.store.dispatch(new ReplicateVehicle(ids));
  }

  export() {
    this.store.dispatch(new ExportVehicle());
  }

}

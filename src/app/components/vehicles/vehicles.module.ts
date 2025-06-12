import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxEditorModule } from 'ngx-editor';

import { SharedModule } from "../../shared/shared.module";

// State
import { ProductState } from '../../shared/state/product.state';
import { StoreState } from '../../shared/state/store.state';
import { AttributeState } from '../../shared/state/attribute.state';
import { CategoryState } from '../../shared/state/category.state';
import { TagState } from '../../shared/state/tag.state';
import { TaxState } from '../../shared/state/tax.state';
import { SettingState } from '../../shared/state/setting.state';
import {VehiclesComponent} from './vehicles.component';
import {CreateVehicleComponent} from './create-vehicle/create-vehicle.component';
import {EditVehicleComponent} from './edit-vehicle/edit-vehicle.component';
import {FormVehicleComponent} from './form-vehicle/form-vehicle.component';
import {VehiclesRoutingModule} from './vehicles-routing.module';
import {BrandState} from '../../shared/state/brand.state';
import {VehicleState} from '../../shared/state/vehicle.state';
import {GoogleMapsModule} from '@angular/google-maps';

@NgModule({
  declarations: [
    VehiclesComponent,
    CreateVehicleComponent,
    EditVehicleComponent,
    FormVehicleComponent
  ],
  imports: [
    CommonModule,
    VehiclesRoutingModule,
    SharedModule,
    GoogleMapsModule,
    NgxEditorModule,
    NgxsModule.forFeature([
      VehicleState,
      StoreState,
      BrandState,
      AttributeState,
      CategoryState,
      TagState,
      TaxState,
      SettingState
    ])
  ]
})
export class VehiclesModule { }

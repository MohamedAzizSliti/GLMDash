import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from "../../shared/shared.module";

// State
import { ProductState } from '../../shared/state/product.state';
import { OrderState } from '../../shared/state/order.state';
import { ReviewState } from '../../shared/state/review.state';
import { BlogState } from '../../shared/state/blog.state';
import { CategoryState } from '../../shared/state/category.state';
import { StoreState } from '../../shared/state/store.state';
import {Dashboard_salesComponent} from './dashboard_sales.component';
import {Dashboard_salesRoutingModule} from './dashboard_sales-routing.module';
import { ApiService } from '../../shared/services/api.service';

@NgModule({
  declarations: [
    Dashboard_salesComponent
  ],
  imports: [
    CommonModule,
    Dashboard_salesRoutingModule,
    SharedModule,
    NgxsModule.forFeature([
      ProductState,
      OrderState,
      ReviewState,
      BlogState,
      CategoryState,
      StoreState
    ]),
  ],
  providers: [
    ApiService
  ]
})
export class Dashboard_salesModule { }

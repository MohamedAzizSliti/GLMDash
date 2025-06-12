import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
 import {Dashboard_salesComponent} from './dashboard_sales.component';

const routes: Routes = [
  {
    path: "",
    component: Dashboard_salesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Dashboard_salesRoutingModule {}

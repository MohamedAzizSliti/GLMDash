import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductComponent } from './product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

// Permission Guard
import { PermissionGuard } from './../../core/guard/permission.guard';
import {CreateCourseComponent} from "./create-course/create-course.component";
import {EditCourseComponent} from "./edit-course/edit-course.component";

const routes: Routes = [
  {
    path: "",
    component: ProductComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: 'product.index' 
    }
  },
  {
    path: "create",
    component: CreateCourseComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['product.index', 'product.create']
     }
  },
  {
    path: "edit/:id",
    component: EditCourseComponent,
    canActivate: [PermissionGuard],
    data: { 
      permission: ['product.index', 'product.edit']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

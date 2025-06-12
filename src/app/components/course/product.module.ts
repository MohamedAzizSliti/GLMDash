import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { NgxEditorModule } from 'ngx-editor';
import { ProductRoutingModule } from './product-routing.module';
import { SharedModule } from "../../shared/shared.module";

// Components
import { ProductComponent } from './product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { FormProductComponent } from './form-product/form-product.component';

// State
import { ProductState } from '../../shared/state/product.state';
import { StoreState } from '../../shared/state/store.state';
import { AttributeState } from '../../shared/state/attribute.state';
import { CategoryState } from '../../shared/state/category.state';
import { TagState } from '../../shared/state/tag.state';
import { TaxState } from '../../shared/state/tax.state';
import { SettingState } from '../../shared/state/setting.state';
import {CreateCourseComponent} from "./create-course/create-course.component";
import {FormCourseComponent} from "./form-course/form-course.component";
import {EditCourseComponent} from "./edit-course/edit-course.component";

@NgModule({
  declarations: [
    ProductComponent,
    CreateProductComponent,
    CreateCourseComponent,
    EditProductComponent,
    FormProductComponent,
    FormCourseComponent,
    EditCourseComponent
  ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        SharedModule,
        NgxEditorModule,
        NgxsModule.forFeature([
            ProductState,
            StoreState,
            AttributeState,
            CategoryState,
            TagState,
            TaxState,
            SettingState
        ]),
     ]
})
export class ProductModule { }

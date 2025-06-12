import {Component, ViewChild} from '@angular/core';

import {Select, Store} from "@ngxs/store";
 import {Observable} from "rxjs";

import {Params, Router} from "@angular/router";
import {Product, ProductModel} from "../../../../shared/interface/product.interface";
import {ProductState} from "../../../../shared/state/product.state";
import {
    ImportCsvModalComponent
} from "../../../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";
import {TableClickedAction, TableConfig} from "../../../../shared/interface/table.interface";
import {GetProducts} from "../../../../shared/action/product.action";

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styleUrl: './select-course.component.scss'
})
export class SelectCourseComponent {

    @Select(ProductState.product) product$: Observable<ProductModel>;

    @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;
    constructor(private store: Store,
                private router: Router) {
    }

    ngOnInit() {
        this.product$.subscribe(product => {

            let products = product?.data?.filter((element: Product) => {
                element.stock = element.stock_status ? `<div class="status-${element.stock_status}"><span>${element.stock_status.replace(/_/g, " ")}</span></div>` : '-';
                element.store_name = element?.store ? element?.store?.store_name : '-';
                element.category_lbl = element?.categories?.length > 0 ? element?.categories[0].name : '____' ;

                return element;
            });
            this.tableConfig.data = product ? products : [];
            this.tableConfig.total = product ? product?.total : 0;
        });
    }

    public tableConfig: TableConfig = {
        columns: [
            { title: "Thumbnail", dataField: "media_path", class: 'tbl-image', type: 'image', placeholder: 'assets/images/product.png' },
            { title: "Course Name", dataField: "title", sortable: true, sort_direction: 'desc' },
            { title: "Category", dataField: "category.name",  sortable: true, sort_direction: 'desc' },
            { title: "Price", dataField: "regular_price", type: 'price', sortable: true, sort_direction: 'desc' },
        ],
        rowActions: [
            { label: "view_exams", actionToPerform: "view-exams", icon: "ri-eye-line", permission: "product.edit"  },
         ],
        data: [] as Product[],
        total: 0
    };


    onTableChange(data?: Params) {
        this.store.dispatch(new GetProducts(data));
    }


    onActionClicked(action: TableClickedAction) {
        if(action.actionToPerform == 'view-exams')
            this.edit(action.data)

    }

    edit(data: Product) {
        this.router.navigateByUrl(`exam-management/exam/list/${data.id}`);
    }

    test(event){
        alert('row clicked')
    }
}

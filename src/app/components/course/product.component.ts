import { Component, ViewChild } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Params } from "../../shared/interface/core.interface";
import { TableConfig, TableClickedAction } from "../../shared/interface/table.interface";
import { Product, ProductModel } from "../../shared/interface/product.interface";
import { ProductState } from '../../shared/state/product.state';
import { GetProducts, UpdateProductStatus, ApproveProductStatus, 
         DeleteProduct, DeleteAllProduct, ReplicateProduct, ExportProduct } from '../../shared/action/product.action';
import { ImportCsvModalComponent } from "../../shared/components/ui/modal/import-csv-modal/import-csv-modal.component";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  
  @Select(ProductState.product) product$: Observable<ProductModel>;

  @ViewChild("csvModal") CSVModal: ImportCsvModalComponent;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "image", dataField: "media_path", class: 'tbl-image', type: 'image', placeholder: 'assets/images/product.png' },
      { title: "name", dataField: "title", sortable: true, sort_direction: 'desc' },
      { title: "Category", dataField: "category.name",  sortable: true, sort_direction: 'desc' },
      { title: "Teacher", dataField: "instructor.name",  sortable: true, sort_direction: 'desc' },
      { title: "price", dataField: "regular_price", type: 'price', sortable: true, sort_direction: 'desc' },
     // { title: "approved", dataField: "is_approved", type: "switch", canAllow: ['admin'] },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "product.edit"  },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "product.destroy"  }
    ],
    data: [] as Product[],
    total: 0
  };

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

  onTableChange(data?: Params) {
    this.store.dispatch(new GetProducts(data));
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
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
    else if(action.actionToPerform == 'duplicate')
      this.duplicate(action.data)
  }

  edit(data: Product) {
    this.router.navigateByUrl(`/course/edit/${data.id}`);
  }

  approve(data: Product) {
    this.store.dispatch(new ApproveProductStatus(data.id, data.is_approved));
  }

  status(data: Product) {
    this.store.dispatch(new UpdateProductStatus(data.id, data.status));
  }

  delete(data: Product) {
    this.store.dispatch(new DeleteProduct(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllProduct(ids));
  }

  duplicate(ids: number[]) {
    this.store.dispatch(new ReplicateProduct(ids));
  }

  export() {
    this.store.dispatch(new ExportProduct());
  }

}

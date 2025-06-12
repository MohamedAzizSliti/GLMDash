import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Product, ProductModel } from "../interface/product.interface";

@Injectable({
  providedIn: "root",
})
export class ProductService {

  constructor(private http: HttpClient) {}

  getProducts(payload?: Params): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${environment.URL}/course`, { params: payload });
  }

  createProduct(payload: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.URL}/course`, payload);
  }

  editProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.URL}/course/${id}`);
  }

  updateProduct(id: number, payload: Product): Observable<Product> {
    return this.http.put<Product>(`${environment.URL}/course/${id}`, payload);
  }

  updateProductStatus(id: number, status: boolean): Observable<Product> {
    return this.http.put<Product>(`${environment.URL}/course/${id}/${status}`, {});
  }

  approveProductStatus(id: number, status: boolean): Observable<Product> {
    return this.http.put<Product>(`${environment.URL}/course/approve/${id}/${status}`, {});
  }

  deleteProduct(id: number): Observable<number> {
    return this.http.delete<number>(`${environment.URL}/course/${id}`);
  }

  deleteAllProduct(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/course/deleteAll`, {ids: ids});
  }

  replicateProduct(ids: number[]): Observable<number> {
    return this.http.post<number>(`${environment.URL}/course/replicate`, {ids: ids});
  }

  importProduct(payload: File[]): Observable<Product[]> {
    let form = new FormData();
    if(Array.isArray(payload) && payload.length) {
      payload.forEach((element: File, index: number) => {
        form.append(`courses`, element, element.name);
      });
    }
    return this.http.post<Product[]>(`${environment.URL}/course/csv/import`, form);
  }

  exportProduct(): Observable<Blob> {
    const requestBody = {}; // You can provide any necessary request body here
    return this.http.post<Blob>(`${environment.URL}/course/csv/export`, requestBody, {
      responseType: 'blob' as 'json'
    });
  }

}

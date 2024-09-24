import { Component } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../../types';
import { ProductComponent } from "../components/product/product.component";
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from "../components/edit-popup/edit-popup.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent,EditPopupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    constructor(
      private productService: ProductsService,
    ) {  
    }
    selectedProduct: Product = {
      id: 0,
      price: '',
      name: '',
      image: '',
      rating: 0,
    }
    displayEditPopup: boolean = false;
    displayAddPopup: boolean = false;
    toogleEditPopup(product: Product){
      this.selectedProduct = product;
      this.displayEditPopup = true;
    }
    toogleAddPopup(){
      this.displayAddPopup = true;
    }

    onConfirmEdit(product: Product, id: number) {
      if (this.selectedProduct.id) {
        return 
      }
      this.editProduct(product, this.selectedProduct.id??0);
      this.displayEditPopup = false;
    }
    onConfirmAdd(product: Product) {
      this.addProduct(product);
      this.displayAddPopup = false;
    }
    products: Product[] = []
    totalRecords: number = 0
    rows: number = 5
    onProductOutput(product: Product) {
      console.log(product, "output");
    }

    onPageChange(event: any) {
      this.fetchProducts(event.page, event.rows);
    }

    fetchProducts(page: number, perpage: number) {
      console.log(event);
      this.productService.getProducts("http://localhost:3000/clothes",{page , perpage } ).subscribe({
        next: (products: Products) => {
          this.products = products.items;
          this.totalRecords = products.total;
        },
        error: (err) => {console.error("Error fetching products", err)},
      });
    }

    editProduct(product: Product, id: number) {
      this.productService.editProduct(`http://localhost:3000/clothes/${id}`, product).subscribe(
        {
          next: (data) => {console.log(data)
            this.fetchProducts(0, this.rows)
          },
          error: (err) => {console.error("Error editing product", err)},
        }
      )
      console.log(product, "edit");
    }

    deleteProduct(id: number) {
      this.productService.deleteProduct(`http://localhost:3000/clothes/${id}`).subscribe(
        {
          next: (data) => {console.log(data);
            this.fetchProducts(0, this.rows)
          },
          error: (err) => {console.error("Error deleting product", err)},
        }
      )
    }   
     addProduct(product: Product) {
      this.productService.editProduct(`http://localhost:3000/clothes/`, product).subscribe(
        {
          next: (data) => {console.log(data);
            this.fetchProducts(0, this.rows)
          },
          error: (err) => {console.error("Error Creating a product", err)},
        }
      )
      console.log(product, "create");
    }
    ngOnInit() {
      this.fetchProducts(0, this.rows)
    }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CartComponent } from '../cart/cart.component';

@NgModule({
  declarations: [ProductsComponent, ProductDetailsComponent, CartComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],
})
export class ProductsModule {}

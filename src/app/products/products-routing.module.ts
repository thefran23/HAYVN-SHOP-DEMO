import { ProductsComponent } from 'src/app/products/products.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsResolver } from './products.resolver';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductDetailsResolver } from '../product-details/product-details.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    resolve: { data: ProductsResolver },
  },
  {
    path: ':id',
    component: ProductDetailsComponent,
    resolve: { data: ProductDetailsResolver },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}

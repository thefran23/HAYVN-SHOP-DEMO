import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import * as fromRoot from 'src/app/core/ngrx/index';
import { PLACEHOLDER_IMG } from '../core/consts/helpers';
import { ProductImage, SaleProduct } from '../core/models/product.model';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  selectedProduct$ = this.getSelectedProductToDisplay();
  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {}

  getSelectedProductToDisplay() {
    return combineLatest([
      this.store.select((s) => s.products.selectedProduct),
      this.store.select((s) => s.products.saleProducts),
      this.store.select((s) => s.products.productImages),
    ]).pipe(
      map(([product, saleProducts, productImages]) => {
        const onSale: SaleProduct | undefined = saleProducts.find(
          (saleProduct) =>
            saleProduct.url === product.url &&
            new Date(saleProduct.valid_until) > new Date()
        );
        const productImage: ProductImage | undefined = productImages.find(
          (productImage) => productImage.url === product.url
        );
        return {
          ...product,
          salePrice: onSale
            ? (
                +product.cost_in_credits *
                (onSale.discount_percent / 100)
              ).toFixed(2)
            : null,
          image: productImage ? productImage.image : PLACEHOLDER_IMG,
        };
      })
    );
  }
}

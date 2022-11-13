import { Component, OnInit } from '@angular/core';
import * as fromRoot from 'src/app/core/ngrx/index';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { PLACEHOLDER_IMG } from '../core/consts/helpers';
import { SaleProduct, ProductImage } from '../core/models/product.model';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItemsToDisplay$ = this.store.select((s) => s.products.cart);
  total$ = this.getTotal();

  constructor(private store: Store<fromRoot.State>) {}

  ngOnInit(): void {}

  getCartItemsToDisplay() {
    return combineLatest([
      this.store.select((s) => s.products.cart),
      this.store.select((s) => s.products.saleProducts),
      this.store.select((s) => s.products.productImages),
    ]).pipe(
      map(([products, saleProducts, productImages]) => {
        return products.map((product) => {
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
        });
      })
    );
  }

  getTotal() {
    return this.store
      .select((s) => s.products.cart)
      .pipe(
        map((products) => {
          const saleTotal = products.reduce(
            (prev, item) =>
              prev +
              (item.discount_percent
                ? +item.cost_in_credits * (item.discount_percent / 100)
                : +item.cost_in_credits),
            0
          );
          return saleTotal;
        })
      );
  }
}

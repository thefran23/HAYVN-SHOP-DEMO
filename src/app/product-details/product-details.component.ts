import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Subject, takeUntil } from 'rxjs';
import * as fromRoot from 'src/app/core/ngrx/index';
import {
  CartProduct,
  ProductImage,
  SaleProduct,
} from '../core/models/product.model';

import {
  PLACEHOLDER_IMG,
  addToCart as addToCartHelperFunction,
  removeFromToCart as removeFromCartHelperFunction,
} from '../core/consts/helpers';
import { Actions, ofType } from '@ngrx/effects';
import {
  loadProductDetails,
  loadProductDetailsFailure,
  loadProductDetailsSuccess,
} from '../core/ngrx/products/products.actions';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  selectedProduct$ = this.getSelectedProductToDisplay();
  showLoader$ = new BehaviorSubject(false);
  destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.actions$
      .pipe(takeUntil(this.destroyed$), ofType(loadProductDetails))
      .subscribe(() => {
        this.showLoader$.next(true);
      });

    this.actions$
      .pipe(
        takeUntil(this.destroyed$),
        ofType(loadProductDetailsSuccess, loadProductDetailsFailure)
      )
      .subscribe(() => {
        this.showLoader$.next(false);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

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
            : undefined,
          image: productImage ? productImage.image : PLACEHOLDER_IMG,
        };
      })
    );
  }

  addToCart(product: CartProduct) {
    addToCartHelperFunction(product, this.store);
  }

  removeFromCart(url: string) {
    removeFromCartHelperFunction(url, this.store);
  }
}

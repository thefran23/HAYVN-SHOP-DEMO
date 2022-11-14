import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  skip,
  startWith,
  Subject,
  Subscription,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import * as fromRoot from 'src/app/core/ngrx/index';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { FormControl } from '@angular/forms';
import {
  CartProduct,
  Product,
  ProductImage,
  SaleProduct,
} from '../core/models/product.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  addToCart,
  loadProductDetailsSuccess,
  loadProducts,
  loadProductsFailure,
  loadProductsSuccess,
  removeFromCart,
  searchProducts,
} from '../core/ngrx/products/products.actions';
import {
  PLACEHOLDER_IMG,
  addToCart as addToCartHelperFunction,
  removeFromToCart as removeFromCartHelperFunction,
} from '../core/consts/helpers';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport)
  viewPort!: CdkVirtualScrollViewport;
  searchTermControl = new FormControl();
  formCtrlSub!: Subscription;
  destroyed$: Subject<void> = new Subject<void>();
  productsToDisplay$ = this.getProductsToDisplay();
  showLoader$ = new BehaviorSubject(false);

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions
  ) {}

  ngOnInit(): void {
    this.actions$
      .pipe(
        takeUntil(this.destroyed$),
        ofType(loadProductsSuccess, loadProductsFailure)
      )
      .subscribe(() => {
        this.showLoader$.next(false);
      });

    this.actions$
      .pipe(takeUntil(this.destroyed$), ofType(loadProducts))
      .subscribe(() => {
        this.showLoader$.next(true);
      });

    this.searchTermControl.valueChanges
      .pipe(
        skip(1),
        takeUntil(this.destroyed$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.showLoader$.next(true);
          this.store.dispatch(searchProducts({ searchTerm }));
        } else {
          this.showLoader$.next(true);
          this.store.dispatch(loadProducts({}));
        }
      });
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  scrollEvent() {
    if (this.viewPort.measureScrollOffset('bottom') < 60) {
      let starshipsNext$ = this.store.select((s) => s.products.starshipsNext);
      let vehiclesNext$ = this.store.select((s) => s.products.vehiclesNext);
      let productsLoaded$ = this.store.select(
        (s) => s.products.productsList.length > 0
      );
      combineLatest([starshipsNext$, vehiclesNext$, productsLoaded$])
        .pipe(
          take(1),
          map(([starshipsUrl, vehiclesUrl, loaded]) => {
            if (loaded) {
              this.store.dispatch(loadProducts({ vehiclesUrl, starshipsUrl }));
            }
          })
        )
        .subscribe();
    }
  }
  addToCart(product: CartProduct) {
    addToCartHelperFunction(product, this.store);
  }

  removeFromCart(url: string) {
    removeFromCartHelperFunction(url, this.store);
  }

  getProductsToDisplay() {
    return combineLatest([
      this.store.select((s) => s.products.productsList),
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

  clear() {
    this.searchTermControl.setValue('');
    this.store.dispatch(loadProducts({}));
  }
}

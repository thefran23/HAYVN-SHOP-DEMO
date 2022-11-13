import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  map,
  startWith,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import * as fromRoot from 'src/app/core/ngrx/index';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { FormControl } from '@angular/forms';
import {
  Product,
  ProductImage,
  SaleProduct,
} from '../core/models/product.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  addToCart,
  loadProducts,
  removeFromCart,
  searchProducts,
} from '../core/ngrx/products/products.actions';

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

  constructor(
    private store: Store<fromRoot.State>,
    private actions$: Actions // private router: Router
  ) {}

  ngOnInit(): void {
    this.searchTermControl.valueChanges
      .pipe(startWith(''), takeUntil(this.destroyed$))
      .subscribe((searchTerm) => {
        if (searchTerm) {
          this.store.dispatch(searchProducts({ searchTerm }));
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
  addToCart(product: Product) {
    this.store.dispatch(addToCart({ product }));
  }

  removeFromCart(url: string) {
    this.store.dispatch(removeFromCart({ url }));
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
            image: productImage ? productImage.image : null,
          };
        });
      })
    );
  }

  clear() {
    this.searchTermControl.setValue('');
  }
}

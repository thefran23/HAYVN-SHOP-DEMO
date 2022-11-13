import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { take, concatMap, tap } from 'rxjs/operators';
import * as fromRoot from 'src/app/core/ngrx/index';
import {
  loadProductImages,
  loadProducts,
  loadSaleProducts,
} from '../core/ngrx/products/products.actions';

@Injectable({
  providedIn: 'root',
})
export class ProductsResolver implements Resolve<boolean> {
  constructor(private store: Store<fromRoot.State>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      take(1),
      concatMap((store) => {
        const productsLoaded = store.products.productsList.length > 0;
        if (productsLoaded) {
          return of(true);
        }
        return of(true).pipe(
          tap(() => {
            this.store.dispatch(loadProducts({}));
            this.store.dispatch(loadSaleProducts());
            this.store.dispatch(loadProductImages());
          })
        );
      })
    );
  }
}

import { ProductsService } from '../../services/products.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as ProductActions from './products.actions';

@Injectable()
export class ProductsEffects {
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      // Using concatMap since we are using a infinite scroll and we do not want to cancel the prev request if it has not completed.
      concatMap((payload) => {
        return this.productsService
          .getProducts(payload.vehiclesUrl, payload.starshipsUrl)
          .pipe(
            mergeMap((res) => {
              console.log('res ', res);
              return [
                ProductActions.loadProductsSuccess({
                  products: res.results,
                  vehiclesNext: res.vehiclesNext,
                  starshipsNext: res.starshipsNext,
                }),
              ];
            })
          );
      }),
      catchError((error) => {
        console.error(error);
        return [ProductActions.loadProductsFailure()];
      })
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.searchProducts),
      // Using mergemap to prevent unnecesary requetss when searching
      mergeMap((payload) => {
        return this.productsService
          .searchProductsByName(payload.searchTerm)
          .pipe(
            mergeMap((res) => {
              console.log('res ', res);
              return [
                ProductActions.loadProductsSuccess({
                  products: res.results,
                  vehiclesNext: res.vehiclesNext,
                  starshipsNext: res.starshipsNext,
                }),
              ];
            })
          );
      }),
      catchError((error) => {
        console.error(error);
        return [ProductActions.loadProductsFailure()];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private productsService: ProductsService
  ) {}
}

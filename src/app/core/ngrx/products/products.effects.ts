import { ProductsService } from '../../services/products.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, mergeMap } from 'rxjs/operators';

import * as ProductActions from './products.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { errorConfig, genericErrorMsg } from '../../consts/helpers';

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
        this.snackbar.open(genericErrorMsg, '×', errorConfig);
        return [ProductActions.loadProductsFailure()];
      })
    )
  );

  loadSaleProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadSaleProducts),
      concatMap(() => {
        return this.productsService.getSaleProducts().pipe(
          mergeMap((res) => {
            console.log('sale res ', res);
            return [
              ProductActions.loadSaleProductsSuccess({
                saleProducts: res,
              }),
            ];
          })
        );
      }),
      catchError((error) => {
        console.error(error);
        this.snackbar.open(genericErrorMsg, '×', errorConfig);
        return [ProductActions.loadProductsFailure()];
      })
    )
  );

  loadProductImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductImages),
      concatMap(() => {
        return this.productsService.getProductImages().pipe(
          mergeMap((res) => {
            return [
              ProductActions.loadProductImagesSuccess({
                productImages: res,
              }),
            ];
          })
        );
      }),
      catchError((error) => {
        console.error(error);
        this.snackbar.open(genericErrorMsg, '×', errorConfig);
        return [ProductActions.loadProductImagesFailure()];
      })
    )
  );

  searchProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.searchProducts),
      // Using mergeMap to prevent unnecessary requests when searching
      mergeMap((payload) => {
        return this.productsService.searchProducts(payload.searchTerm).pipe(
          mergeMap((res) => {
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
        this.snackbar.open(genericErrorMsg, '×', errorConfig);
        return [ProductActions.loadProductsFailure()];
      })
    )
  );

  loadProductDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProductDetails),
      // Using mergeMap to cancel prev requests
      mergeMap((payload) => {
        return this.productsService.getProduct(payload.url).pipe(
          mergeMap((product) => {
            return [ProductActions.loadProductDetailsSuccess({ product })];
          })
        );
      }),
      catchError((error) => {
        console.error(error);
        this.snackbar.open(genericErrorMsg, '×', errorConfig);
        return [ProductActions.loadProductDetailsFailure()];
      })
    )
  );

  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private snackbar: MatSnackBar
  ) {}
}

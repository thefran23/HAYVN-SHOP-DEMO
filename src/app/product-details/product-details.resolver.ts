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
import { routeParamToProductUrl } from '../core/consts/helpers';

import {
  loadProductDetails,
  setProductDetails,
} from '../core/ngrx/products/products.actions';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsResolver implements Resolve<boolean> {
  constructor(private store: Store<fromRoot.State>) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const paramProductUrl = routeParamToProductUrl(route.params['id']);

    return this.store.pipe(
      take(1),
      concatMap((store) => {
        const productDetails = store.products.productsList.find(
          (product) => product.url === paramProductUrl
        );
        // If the product already exists in state, we do not have to fetch it again
        if (productDetails) {
          this.store.dispatch(setProductDetails({ product: productDetails }));
          return of(true);
        }
        // If the product does not exist in state, we have to fetch it (I.e the user was deep linked to the details view page)
        return of(true).pipe(
          tap(() =>
            this.store.dispatch(
              loadProductDetails({
                url: paramProductUrl,
              })
            )
          )
        );
      })
    );
  }
}

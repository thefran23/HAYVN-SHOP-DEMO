import { Store } from '@ngrx/store';
import { CartProduct } from '../models/product.model';
import {
  addToCart as addToCartAction,
  removeFromCart,
} from '../../core/ngrx/products/products.actions';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
export const SWAPI_BASE_URL = 'https://swapi.dev/api/';

export const PLACEHOLDER_IMG =
  'https://previews.123rf.com/images/zdeneksasek/zdeneksasek1812/zdeneksasek181200130/113856614-black-and-white-ink-concept-art-drawing-of-futuristic-or-sci-fi-spaceship-or-spacecraft-.jpg';

export const routeParamToProductUrl = (routeParam: string) => {
  return SWAPI_BASE_URL + routeParam.replace('-', '/') + '/';
};

export const addToCart = (product: CartProduct, store: Store) => {
  store.dispatch(addToCartAction({ product }));
};

export const removeFromToCart = (url: string, store: Store) => {
  store.dispatch(removeFromCart({ url }));
};

export const errorConfig: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'right',
  verticalPosition: 'top',
  panelClass: 'g-error-panel',
};

export const genericErrorMsg = 'Something unexpected happened';

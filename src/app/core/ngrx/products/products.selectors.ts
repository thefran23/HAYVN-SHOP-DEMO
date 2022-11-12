import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProducts from './products.reducer';

export const selectProductsState = createFeatureSelector<fromProducts.State>(
  fromProducts.productsFeatureKey
);

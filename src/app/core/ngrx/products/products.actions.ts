import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product.model';

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ vehiclesUrl?: string; starshipsUrl?: string }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; vehiclesNext: string; starshipsNext: string }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure'
);

export const searchProducts = createAction(
  '[Products] Search Products',
  props<{ searchTerm: string }>()
);

export const searchProductsSuccess = createAction(
  '[Products] Search Products Success',
  props<{ products: Product[]; vehiclesNext: string; starshipsNext: string }>()
);

export const searchProductsFailure = createAction(
  '[Products] Search Products Failure'
);

export const clearProducts = createAction('[Products NF] Clear Products');

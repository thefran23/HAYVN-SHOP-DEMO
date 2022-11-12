import { Action, createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product.model';
import * as ProductsActions from './products.actions';

export const productsFeatureKey = 'products';

export interface State {
  productsList: Product[];
  vehiclesNext: string;
  starshipsNext: string;
}

export const initialState: State = {
  productsList: [],
  vehiclesNext: '',
  starshipsNext: '',
};

export const reducer = createReducer(
  initialState,

  on(ProductsActions.loadProducts, (state) => {
    return { ...state, ...initialState };
  }),
  on(
    ProductsActions.loadProductsSuccess,
    (state, { products, vehiclesNext, starshipsNext }) => {
      return {
        ...state,
        productsList: [...products],
        vehiclesNext,
        starshipsNext,
      };
    }
  ),
  on(ProductsActions.loadProductsFailure, (state, action) => state)
);

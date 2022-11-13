import { Action, createReducer, on } from '@ngrx/store';
import { catchError } from 'rxjs';
import { Product, SaleProduct } from '../../models/product.model';
import * as ProductsActions from './products.actions';

export const productsFeatureKey = 'products';

export interface State {
  productsList: Product[];
  saleProducts: SaleProduct[];
  cart: Product[];
  vehiclesNext: string;
  starshipsNext: string;
  selectedProduct: Product;
}

export const initialState: State = {
  productsList: [],
  saleProducts: [],
  cart: [],
  vehiclesNext: '',
  starshipsNext: '',
  selectedProduct: {} as Product,
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
  on(ProductsActions.loadSaleProductsSuccess, (state, { saleProducts }) => {
    return {
      ...state,
      saleProducts,
    };
  }),
  on(ProductsActions.setProductDetails, (state, { product }) => {
    return { ...state, productDetails: product };
  }),

  on(ProductsActions.addToCart, (state, { product }) => {
    return { ...state, cart: [...state.cart, product] };
  }),

  on(ProductsActions.removeFromCart, (state, { url }) => {
    const indexOfItem = state.cart.findIndex((product) => product.url === url);
    if (indexOfItem === -1) {
      return { ...state };
    }
    return {
      ...state,
      cart: [
        ...state.cart.slice(0, indexOfItem),
        ...state.cart.slice(indexOfItem + 1),
      ],
    };
  }),

  on(ProductsActions.loadProductDetailsSuccess, (state, { product }) => {
    return { ...state, productDetails: product };
  }),
  on(ProductsActions.loadProductsFailure, (state, action) => state)
);

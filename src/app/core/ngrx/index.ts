import { ActionReducerMap } from '@ngrx/store';
import {
  productsState,
  productsReducer,
  productsSelectors as _productsSelectors,
} from './products/index';

export interface State {
  products: productsState;
}

export const reducers: ActionReducerMap<State> = {
  products: productsReducer,
};

export const productsSelectors = _productsSelectors;

import { ActionReducerMap } from '@ngrx/store';
import { productsState, productsReducer } from './products/index';

export interface State {
  products: productsState;
}

export const reducers: ActionReducerMap<State> = {
  products: productsReducer,
};

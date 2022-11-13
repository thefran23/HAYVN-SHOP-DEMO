import { createAction, props } from '@ngrx/store';
import {
  CartProduct,
  Product,
  ProductImage,
  SaleProduct,
} from '../../models/product.model';

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

export const loadSaleProducts = createAction('[Products] Load Sale Products');

export const loadSaleProductsSuccess = createAction(
  '[Products] Load Sale Products Success',
  props<{
    saleProducts: SaleProduct[];
  }>()
);

export const loadSaleProductsFailure = createAction(
  '[Products] Load Sale Products Failure'
);

export const loadProductImages = createAction('[Products] Load Product Images');

export const loadProductImagesSuccess = createAction(
  '[Products] Load Product Images Success',
  props<{
    productImages: ProductImage[];
  }>()
);

export const loadProductImagesFailure = createAction(
  '[Products] Load Product images'
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

export const setProductDetails = createAction(
  '[ProductDetails] [NF] Set Product Details',
  props<{ product: Product }>()
);

export const addToCart = createAction(
  '[Product] [NF] Add Product to Cart',
  props<{
    product: CartProduct;
  }>()
);

export const removeFromCart = createAction(
  '[Product] [NF] Remove Product from Cart',
  props<{ url: string }>()
);

export const loadProductDetails = createAction(
  '[ProductDetails] Load ProductDetails',
  props<{ url: string }>()
);

export const loadProductDetailsSuccess = createAction(
  '[ProductDetails] Load ProductDetails Success',
  props<{ product: Product }>()
);

export const loadProductDetailsFailure = createAction(
  '[ProductDetails] Load ProductDetails Failure'
);

export const clearProducts = createAction('[Products NF] Clear Products');

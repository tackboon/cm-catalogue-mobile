import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { ProductState } from "./product.reducer";

export const selectProductReducer = (state: RootState): ProductState =>
  state.product;

export const selectProducts = createSelector(
  selectProductReducer,
  (product) => product.products
);

export const selectProductError = createSelector(
  selectProductReducer,
  (product) => product.error
);

export const selectProductIsLoading = createSelector(
  selectProductReducer,
  (product) => product.isLoading
);

export const selectProductByID = createSelector(
  [selectProducts, (_, productID: number) => productID],
  (products, productID: number) =>
    products.filter((product) => product.id === productID)[0]
);

import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { CategoryState } from "./category.reducer";

export const selectCateogryReducer = (state: RootState): CategoryState =>
  state.category;

export const selectCategories = createSelector(
  selectCateogryReducer,
  (category) => category.categories
);

export const selectCategoryError = createSelector(
  selectCateogryReducer,
  (category) => category.error
);

export const selectDataIsLoading = createSelector(
  selectCateogryReducer,
  (category) => category.isLoading
);

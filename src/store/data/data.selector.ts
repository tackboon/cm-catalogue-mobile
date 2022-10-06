import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { DataState } from "./data.reducer";

export const selectDataReducer = (state: RootState): DataState =>
  state.data;

export const selectDataVersion = createSelector(
  selectDataReducer,
  (data) => ({
    dbVersion: data.dbVersion,
    fileVersion: data.fileVersion,
  })
);

export const selectDataError = createSelector(
  selectDataReducer,
  (data) => data.error
);

export const selectDataIsLoading = createSelector(
  selectDataReducer,
  (data) => data.isLoading
);

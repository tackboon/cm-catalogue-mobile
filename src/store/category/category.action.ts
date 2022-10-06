import { createAsyncThunk } from "@reduxjs/toolkit";
import { sqlite } from "../../service/sqlite/sqlite_service";

import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { CategoryData, CATEGORY_ACTION_TYPES } from "./category.types";

export type GetCategoryStart = Action<CATEGORY_ACTION_TYPES.GET_CATEGORY_START>;

export type GetCategorySuccess = ActionWithPayload<
  CATEGORY_ACTION_TYPES.GET_CATEGORY_SUCCESS,
  CategoryData[]
>;

export type GetCategoryFailed = ActionWithPayload<
  CATEGORY_ACTION_TYPES.GET_CATEGORY_FAILED,
  string
>;

export const getCategoryStart = withMatcher(
  (): GetCategoryStart => createAction(CATEGORY_ACTION_TYPES.GET_CATEGORY_START)
);

export const getCategorySuccess = withMatcher(
  (data: CategoryData[]): GetCategorySuccess =>
    createAction(CATEGORY_ACTION_TYPES.GET_CATEGORY_SUCCESS, data)
);

export const getCategoryFailed = withMatcher(
  (error: string): GetCategoryFailed =>
    createAction(CATEGORY_ACTION_TYPES.GET_CATEGORY_FAILED, error)
);

// redux-thunk
export const getCategoryStartAsync = createAsyncThunk(
  CATEGORY_ACTION_TYPES.GET_CATEGORY_START_ASYNC,
  async (_, { dispatch }) => {
    dispatch(getCategoryStart());

    sqlite.db.transaction(
      (tx) => {
        tx.executeSql(
          `SELECT id, name, file_id, created_at, updated_at FROM categories
             ORDER BY id ASC`,
          [],
          (_, res) => {
            const categories: CategoryData[] = [];

            for (const data of res.rows._array) {
              categories.push(data);
            }

            dispatch(getCategorySuccess(categories));
          }
        );
      },
      (err) => {
        dispatch(getCategoryFailed(err.message));
      }
    );
  }
);

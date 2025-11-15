import { createAsyncThunk } from "@reduxjs/toolkit";

import { sqlite } from "../../service/sqlite/sqlite_service";
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import {
  ProductData,
  ProductStatus,
  PRODUCT_ACTION_TYPES,
  ProductJoinFile,
} from "./product.types";

export type GetProductStart = Action<PRODUCT_ACTION_TYPES.GET_PRODUCT_START>;

export type GetProductSucess = ActionWithPayload<
  PRODUCT_ACTION_TYPES.GET_PRODUCT_SUCCESS,
  ProductData[]
>;

export type GetProductFailed = ActionWithPayload<
  PRODUCT_ACTION_TYPES.GET_PRODUCT_FAILED,
  string
>;

export const getProductStart = withMatcher(
  (): GetProductStart => createAction(PRODUCT_ACTION_TYPES.GET_PRODUCT_START)
);

export const getProductSucess = withMatcher(
  (data: ProductData[]): GetProductSucess =>
    createAction(PRODUCT_ACTION_TYPES.GET_PRODUCT_SUCCESS, data)
);

export const getProductFailed = withMatcher(
  (err: string): GetProductFailed =>
    createAction(PRODUCT_ACTION_TYPES.GET_PRODUCT_FAILED, err)
);

// redux-thunk
export const getProductStartAsync = createAsyncThunk(
  PRODUCT_ACTION_TYPES.GET_PRODUCT_START_ASYNC,
  async (
    {
      category_id,
      filter,
      status,
    }: { category_id: number; filter: string; status: ProductStatus },
    { dispatch }
  ) => {
    dispatch(getProductStart());

    const args: any[] = [category_id];
    let statusStmt = "";
    let filterStmt = "";

    if (status !== "all") {
      statusStmt = "AND status = ?";
      args.push(status);
    }

    if (filter !== "") {
      filterStmt = "AND name LIKE ?";
      args.push(`%${filter}%`);
    }

    try {
      sqlite.db.withTransactionSync(() => {
        const res = sqlite.db.getAllSync<ProductJoinFile>(
          `SELECT p.id, p.category_id, p.name, p.description, p.price, p.status, p.position,
             p.created_at, p.updated_at, f.file_id, f.is_preview
             FROM products p
             LEFT JOIN products_catalogue_files f ON p.id=f.product_id
             WHERE category_id = ? ${statusStmt} ${filterStmt}
             ORDER BY position DESC`,
          args
        );

        const data: { [key: number]: ProductData } = {};
        const order: number[] = [];

        for (const d of res) {
          if (data[d.id]) {
            if (d.file_id !== "") {
              data[d.id].files.push({
                product_id: d.id,
                file_id: d.file_id,
                is_preview: d.is_preview,
              });

              if (d.is_preview === 1) {
                data[d.id].preview_id = d.file_id;
              }
            }
          } else {
            order.push(d.id);

            data[d.id] = {
              id: d.id,
              category_id: d.category_id,
              name: d.name,
              description: d.description,
              price: d.price,
              status: d.status,
              position: d.position,
              created_at: d.created_at,
              updated_at: d.updated_at,
              preview_id: "",
              files: [],
            };

            if (d.file_id !== "") {
              data[d.id].files.push({
                product_id: d.id,
                file_id: d.file_id,
                is_preview: d.is_preview,
              });

              if (d.is_preview === 1) {
                data[d.id].preview_id = d.file_id;
              }
            }
          }
        }

        const products = order.map((id) => data[id]);
        dispatch(getProductSucess(products));
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected database error";
      dispatch(getProductFailed(message));
    }
  }
);

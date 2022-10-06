export enum CATEGORY_ACTION_TYPES {
  GET_CATEGORY_START = "category/GET_CATEGORY_START",
  GET_CATEGORY_START_ASYNC = "category/GET_CATEGORY_START_ASYNC",
  GET_CATEGORY_SUCCESS = "category/GET_CATEGORY_SUCCESS",
  GET_CATEGORY_FAILED = "category/GET_CATEGORY_FAILED",
}

export enum CATEGORY_LOADING_TYPES {
  GET_CATEGORY = "loading/GET_CATEGORY",
}

export enum CATEGORY_ERROR_TYPES {
  GET_CATEGORY = "error/GET_CATEGORY",
}

export type CategoryData = {
  id: number;
  name: string;
  file_id: string;
  created_at: Date;
  updated_at: Date;
};

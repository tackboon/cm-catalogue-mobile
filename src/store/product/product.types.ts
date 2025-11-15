export enum PRODUCT_ACTION_TYPES {
  GET_PRODUCT_START = "product/GET_PRODUCT_START",
  GET_PRODUCT_START_ASYNC = "product/GET_PRODUCT_START_ASYNC",
  GET_PRODUCT_SUCCESS = "product/GET_PRODUCT_SUCCESS",
  GET_PRODUCT_FAILED = "product/GET_PRODUCT_FAILED",
}

export enum PRODUCT_LOADING_TYPES {
  GET_PRODUCT = "loading/GET_PRODUCT",
}

export enum PRODUCT_ERROR_TYPES {
  GET_PRODUCT = "error/GET_PRODUCT",
}

export type ProductStatus = "all" | "in_stock" | "out_of_stock";

export const isProductStatus = (value: string): value is ProductStatus =>
  ["all", "in_stock", "out_of_stock"].includes(value);

export type ProductData = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
  position: number;
  created_at: Date;
  updated_at: Date;
  preview_id: string;
  files: ProductFile[];
};

export type ProductFile = {
  product_id: number;
  file_id: string;
  is_preview: number;
};

export type ProductJoinFile = {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  status: ProductStatus;
  position: number;
  created_at: Date;
  updated_at: Date;
  file_id: string;
  is_preview: number;
};

import { AnyAction } from "redux";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  getProductFailed,
  getProductStart,
  getProductSucess,
} from "./product.action";

import {
  ProductData,
  PRODUCT_ERROR_TYPES,
  PRODUCT_LOADING_TYPES,
} from "./product.types";

export type ProductState = {
  readonly products: ProductData[];
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: ProductState = {
  products: [],
  isLoading: initLoadingState(PRODUCT_LOADING_TYPES),
  error: initErrorState(PRODUCT_ERROR_TYPES),
};

export const productReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): ProductState => {
  if (getProductStart.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPES.GET_PRODUCT]: true,
      },
    };
  }

  if (getProductSucess.match(action)) {
    return {
      ...state,
      products: action.payload,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPES.GET_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPES.GET_PRODUCT]: "",
      },
    };
  }

  if (getProductFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [PRODUCT_LOADING_TYPES.GET_PRODUCT]: false,
      },
      error: {
        ...state.error,
        [PRODUCT_ERROR_TYPES.GET_PRODUCT]: action.payload,
      },
    };
  }

  return state;
};

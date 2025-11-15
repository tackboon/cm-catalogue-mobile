import { AnyAction } from "redux";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  getCategoryFailed,
  getCategoryStart,
  getCategorySuccess,
} from "./category.action";

import {
  CategoryData,
  CATEGORY_ERROR_TYPES,
  CATEGORY_LOADING_TYPES,
} from "./category.types";

export type CategoryState = {
  readonly categories: CategoryData[];
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: CategoryState = {
  categories: [],
  isLoading: initLoadingState(CATEGORY_LOADING_TYPES),
  error: initErrorState(CATEGORY_ERROR_TYPES),
};

export const categoryReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): CategoryState => {
  if (getCategoryStart.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.GET_CATEGORY]: true,
      },
    };
  }

  if (getCategorySuccess.match(action)) {
    return {
      ...state,
      categories: action.payload,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.GET_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.GET_CATEGORY]: "",
      },
    };
  }

  if (getCategoryFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [CATEGORY_LOADING_TYPES.GET_CATEGORY]: false,
      },
      error: {
        ...state.error,
        [CATEGORY_ERROR_TYPES.GET_CATEGORY]: action.payload,
      },
    };
  }

  return state;
};

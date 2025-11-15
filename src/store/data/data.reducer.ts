import { AnyAction } from "redux";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  setVersion,
  updateDataFailed,
  updateDataStart,
  updateDataSuccess,
} from "./data.action";
import { DATA_ERROR_TYPES, DATA_LOADING_TYPES } from "./data.types";

export type DataState = {
  readonly dbVersion: number;
  readonly fileVersion: number;
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: DataState = {
  dbVersion: 0,
  fileVersion: 0,
  isLoading: initLoadingState(DATA_LOADING_TYPES),
  error: initErrorState(DATA_ERROR_TYPES),
};

export const dataReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): DataState => {
  if (updateDataStart.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [DATA_LOADING_TYPES.UPDATE_DATA]: true,
      },
    };
  }

  if (updateDataSuccess.match(action)) {
    return {
      ...state,
      dbVersion: action.payload.dbVersion,
      fileVersion: action.payload.fileVersion,
      isLoading: {
        ...state.isLoading,
        [DATA_LOADING_TYPES.UPDATE_DATA]: false,
      },
      error: {
        ...state.error,
        [DATA_ERROR_TYPES.UPDATE_DATA]: "",
      },
    };
  }

  if (updateDataFailed.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [DATA_LOADING_TYPES.UPDATE_DATA]: false,
      },
      error: {
        ...state.error,
        [DATA_ERROR_TYPES.UPDATE_DATA]: action.payload,
      },
    };
  }

  if (setVersion.match(action)) {
    return {
      ...state,
      dbVersion: action.payload.dbVersion,
      fileVersion: action.payload.fileVersion,
    };
  }

  return state;
};

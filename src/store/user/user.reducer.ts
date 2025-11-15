import { AnyAction } from "redux";

import {
  initErrorState,
  initLoadingState,
} from "../../utils/reducer/reducer.util";
import {
  emailSignInStart,
  resetUserError,
  signInFailed,
  signInSuccess,
  signOutStart,
} from "./user.action";
import { UserData, USER_ERROR_TYPES, USER_LOADING_TYPES } from "./user.types";

export type UserState = {
  readonly currentUser: UserData | null;
  readonly token: string;
  readonly isLoading: { [key: string]: boolean };
  readonly error: { [key: string]: string };
};

const INITIAL_STATE: UserState = {
  currentUser: null,
  token: "",
  isLoading: initLoadingState(USER_LOADING_TYPES),
  error: initErrorState(USER_ERROR_TYPES),
};

export const userReducer = (
  state = INITIAL_STATE,
  action: AnyAction
): UserState => {
  if (resetUserError.match(action)) {
    return {
      ...state,
      error: {
        ...state.error,
        [action.payload]: "",
      },
    };
  }

  if (emailSignInStart.match(action)) {
    return {
      ...state,
      isLoading: {
        ...state.isLoading,
        [USER_LOADING_TYPES.SIGN_IN]: true,
      },
    };
  }

  if (signInSuccess.match(action)) {
    return {
      ...state,
      currentUser: action.payload.user,
      token: action.payload.token,
      isLoading: { ...state.isLoading, [USER_LOADING_TYPES.SIGN_IN]: false },
      error: { ...state.error, [USER_ERROR_TYPES.SIGN_IN]: "" },
    };
  }

  if (signInFailed.match(action)) {
    return {
      ...state,
      error: { ...state.error, [USER_ERROR_TYPES.SIGN_IN]: action.payload },
      isLoading: { ...state.isLoading, [USER_LOADING_TYPES.SIGN_IN]: false },
    };
  }

  if (signOutStart.match(action)) {
    return {
      ...state,
      currentUser: null,
      token: "",
    };
  }

  return state;
};

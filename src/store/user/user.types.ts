export enum USER_ACTION_TYPES {
  RESET_USER_ERROR = "user/RESET_USER_ERROR",
  EMAIL_SIGN_IN_START_ASYNC = "user/EMAIL_SIGN_IN_START_ASYNC",
  EMAIL_SIGN_IN_START = "user/EMAIL_SIGN_IN_START",
  GET_USER_INFO_ASYNC = "user/GET_USER_INFO_ASYNC",
  SIGN_IN_SUCCESS = "user/SIGN_IN_SUCCESS",
  SIGN_IN_FAILED = "user/SIGN_IN_FAILED",
  SIGN_OUT_START = "user/SIGN_OUT_START",
  SIGN_OUT_START_ASYNC = "user/SIGN_OUT_START_ASYNC",
}

export enum USER_LOADING_TYPES {
  SIGN_IN = "loading/SIGN_IN",
}

export enum USER_ERROR_TYPES {
  SIGN_IN = "error/SIGN_IN",
}

export type UserData = {
  email: string;
  displayName: string;
  role: string;
};

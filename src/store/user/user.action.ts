import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AuthError,
  firebaseAuthError,
  signInUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";
import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { UserData, USER_ACTION_TYPES, USER_ERROR_TYPES } from "./user.types";
import { api } from "../../service/openapi/openapi.service";

export type ResetUserError = ActionWithPayload<
  USER_ACTION_TYPES.RESET_USER_ERROR,
  USER_ERROR_TYPES
>;

export type EmailSignInStart = Action<USER_ACTION_TYPES.EMAIL_SIGN_IN_START>;

export type SignInSuccess = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_SUCCESS,
  {
    user: UserData;
    token: string;
  }
>;

export type SignInFailed = ActionWithPayload<
  USER_ACTION_TYPES.SIGN_IN_FAILED,
  string
>;

export type SignOutStart = Action<USER_ACTION_TYPES.SIGN_OUT_START>;

export const resetUserError = withMatcher(
  (type: USER_ERROR_TYPES): ResetUserError =>
    createAction(USER_ACTION_TYPES.RESET_USER_ERROR, type)
);

export const emailSignInStart = withMatcher(
  (): EmailSignInStart => createAction(USER_ACTION_TYPES.EMAIL_SIGN_IN_START)
);

export const signInSuccess = withMatcher(
  (user: UserData, token: string): SignInSuccess =>
    createAction(USER_ACTION_TYPES.SIGN_IN_SUCCESS, { user, token })
);

export const signInFailed = withMatcher(
  (error: string): SignInFailed =>
    createAction(USER_ACTION_TYPES.SIGN_IN_FAILED, error)
);

export const signOutStart = withMatcher(
  (): SignOutStart => createAction(USER_ACTION_TYPES.SIGN_OUT_START)
);

// redux-thunk
export const emailSignInStartAsync = createAsyncThunk(
  USER_ACTION_TYPES.EMAIL_SIGN_IN_START_ASYNC,
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    dispatch(emailSignInStart());
    try {
      await AsyncStorage.setItem("token", "");

      // firebase login
      const firebaseRes = await signInUserWithEmailAndPassword(email, password);

      if (firebaseRes.data.idToken) {
        const token = firebaseRes.data.idToken || "";

        // store user info locally
        await AsyncStorage.setItem("lastSignInEmail", email);
        await AsyncStorage.setItem("token", token);

        dispatch(getUserInfoAsync(token));
      } else {
        throw new Error("Failed to get token!");
      }
    } catch (error) {
      let msg = "Authentication Error!";
      const err = error as AxiosError;
      if (err.response && err.response.data) {
        msg = firebaseAuthError(err.response.data as AuthError);
      }
      dispatch(signInFailed(msg));
    }
  }
);

export const getUserInfoAsync = createAsyncThunk(
  USER_ACTION_TYPES.GET_USER_INFO_ASYNC,
  async (token: string, { dispatch }) => {
    dispatch(emailSignInStart());
    try {
      api.setAuthConfig(token);

      // fetch user info from api
      const apiRes = await api.UserAPI.getCurrentUser();

      dispatch(
        signInSuccess(
          {
            email: apiRes.data.email,
            displayName: apiRes.data.display_name,
            role: apiRes.data.role,
          },
          token
        )
      );
    } catch (error) {
      dispatch(signInFailed(error as string));
    }
  }
);

export const signOutStartAsync = createAsyncThunk(
  USER_ACTION_TYPES.SIGN_OUT_START_ASYNC,
  async (_, { dispatch }) => {
    dispatch(signOutStart());
    try {
      await AsyncStorage.setItem("token", "");
    } catch (error) {}
  }
);

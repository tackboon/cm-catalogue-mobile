import "react-native-url-polyfill/auto";
import axios, { AxiosError, AxiosInstance } from "axios";

import { Configuration as UserConfig, UserApi } from "../../openapi/user";
import { Configuration as MobileConfig, MobileApi } from "../../openapi/mobile";

type APIError = {
  slug: string;
};

const API_HOST = process.env.EXPO_PUBLIC_API_HOST || "http://localhost";
const BASE_PATH = {
  userAPI: API_HOST + "/api/v1/users",
  mobileAPI: API_HOST + "/api/v1/mobile",
};

class OpenAPi {
  customAxios: AxiosInstance;
  accessToken = "";
  UserAPI: UserApi;
  MobileAPI: MobileApi;

  constructor() {
    this.customAxios = axios.create();
    this.UserAPI = new UserApi(
      new UserConfig({ accessToken: "" }),
      BASE_PATH.userAPI,
      this.customAxios
    );
    this.MobileAPI = new MobileApi(
      new MobileConfig({ accessToken: "" }),
      BASE_PATH.mobileAPI,
      this.customAxios
    );
  }

  setAxiosConfig() {
    const { store } = require("../../store/store");
    const { signOutStartAsync } = require("../../store/user/user.action");

    this.customAxios.interceptors.response.use(
      (res) => res,
      (error) => {
        if ((error as AxiosError).response?.status === 401) {
          store.dispatch(signOutStartAsync());
        }

        const apiError = (error as AxiosError).response?.data as APIError;
        return Promise.reject(
          apiError && apiError.slug ? error.response.data.slug : error.message
        );
      }
    );
  }

  setAuthConfig(accessToken: string) {
    this.accessToken = accessToken;

    this.setUserAPI();
    this.setMobileAPI();
  }

  setUserAPI() {
    const configuration = new UserConfig({
      accessToken: this.accessToken,
    });
    this.UserAPI = new UserApi(
      configuration,
      BASE_PATH.userAPI,
      this.customAxios
    );
  }

  setMobileAPI() {
    const configuration = new UserConfig({
      accessToken: this.accessToken,
    });
    this.MobileAPI = new MobileApi(
      configuration,
      BASE_PATH.mobileAPI,
      this.customAxios
    );
  }
}

export const api = new OpenAPi();

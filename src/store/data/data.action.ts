import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Directory, File, Paths } from "expo-file-system";
import { unzip } from "react-native-zip-archive";

import {
  Action,
  ActionWithPayload,
  createAction,
  withMatcher,
} from "../../utils/reducer/reducer.util";
import { api } from "../../service/openapi/openapi.service";
import { VersionData, DATA_ACTION_TYPES } from "./data.types";
import { jsonStringify } from "../../utils/json/json.util";
import { RootState } from "../store";
import { sqlite } from "../../service/sqlite/sqlite_service";

export type UpdateDataStart = Action<DATA_ACTION_TYPES.UPDATE_DATA_START>;

export type UpdateDataSuccess = ActionWithPayload<
  DATA_ACTION_TYPES.UPDATE_DATA_SUCCESS,
  VersionData
>;

export type UpdateDataFailed = ActionWithPayload<
  DATA_ACTION_TYPES.UPDATE_DATA_FAILED,
  string
>;

export type SetVersion = ActionWithPayload<
  DATA_ACTION_TYPES.SET_VERSION,
  {
    dbVersion: number;
    fileVersion: number;
  }
>;

export const updateDataStart = withMatcher(
  (): UpdateDataStart => createAction(DATA_ACTION_TYPES.UPDATE_DATA_START)
);

export const updateDataSuccess = withMatcher(
  (data: VersionData): UpdateDataSuccess =>
    createAction(DATA_ACTION_TYPES.UPDATE_DATA_SUCCESS, data)
);

export const updateDataFailed = withMatcher(
  (error: string): UpdateDataFailed =>
    createAction(DATA_ACTION_TYPES.UPDATE_DATA_FAILED, error)
);

export const setVersion = withMatcher(
  (dbVersion: number, fileVersion: number): SetVersion =>
    createAction(DATA_ACTION_TYPES.SET_VERSION, {
      dbVersion,
      fileVersion,
    })
);

// redux-thunk
export const updateDataStartAsync = createAsyncThunk<
  void,
  void,
  { state: RootState }
>(
  DATA_ACTION_TYPES.UPDATE_DATA_START_ASYNC,
  async (_, { dispatch, getState }) => {
    dispatch(updateDataStart());
    try {
      const { data, user } = getState();
      const localVersion = {
        dbVersion: data.dbVersion,
        fileVersion: data.fileVersion,
      };

      const res = await api.MobileAPI.getMobileAPIInfo();
      const remoteVersion = res.data;

      if (localVersion.dbVersion !== remoteVersion.dbVersion) {
        await updateDB(user.token);
      }

      if (localVersion.fileVersion !== remoteVersion.fileVersion) {
        await updateFile(user.token);
      }

      await AsyncStorage.setItem("version", jsonStringify(remoteVersion));
      dispatch(updateDataSuccess(remoteVersion));
    } catch (err) {
      dispatch(updateDataFailed(err as string));
    }
  }
);

const updateDB = async (token: string) => {
  try {
    const dirPath = Paths.document.uri + "db";
    const dir = new Directory(dirPath);

    // clean up old files
    if (dir.exists) dir.delete();

    // create directory
    dir.create();

    // download zip from server
    const downloadURL =
      process.env.EXPO_PUBLIC_API_HOST + "/api/v1/mobile/download/db";
    const downloadDest = new File(dirPath + "/db.zip");
    await File.downloadFileAsync(downloadURL, downloadDest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // unzip
    const unzipDest = dirPath + "/db";
    await unzip(downloadDest.uri, unzipDest, "UTF-8");

    // import data to local database
    await sqlite.importData("db/db");
  } catch (err) {
    console.error(err);
  }
};

const updateFile = async (token: string) => {
  try {
    const dirPath = Paths.document.uri + "file";
    const dir = new Directory(dirPath);

    // clean up old files
    if (dir.exists) dir.delete();

    // create directory
    dir.create();

    // download zip from server
    const downloadURL =
      process.env.EXPO_PUBLIC_API_HOST + "/api/v1/mobile/download/file";
    const downloadDest = new File(dirPath + "/file.zip");
    await File.downloadFileAsync(downloadURL, downloadDest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // unzip
    const unzipDest = dirPath + "/file";
    await unzip(downloadDest.uri, unzipDest, "UTF-8");
  } catch (err) {
    console.error(err);
  }
};

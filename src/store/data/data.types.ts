export enum DATA_ACTION_TYPES {
  UPDATE_DATA_START = "data/CHECK_VERSION_START",
  UPDATE_DATA_START_ASYNC = "data/CHECK_VERSION_START_ASYNC",
  UPDATE_DATA_SUCCESS = "data/CHECK_VERSION_SUCCESS",
  UPDATE_DATA_FAILED = "data/CHECK_VERSION_FAILED",
  SET_VERSION = "data/SET_VERSION",
}

export enum DATA_LOADING_TYPES {
  UPDATE_DATA = "loading/UPDATE_DATA",
}

export enum DATA_ERROR_TYPES {
  UPDATE_DATA = "error/UPDATE_DATA",
}

export type VersionData = {
  dbVersion: number;
  fileVersion: number;
};

export const VersionDataGuard = (obj: Object): obj is VersionData => {
  if (
    (obj as VersionData).dbVersion &&
    typeof (obj as VersionData).dbVersion === "number" &&
    (obj as VersionData).fileVersion &&
    typeof (obj as VersionData).fileVersion === "number"
  ) {
    return true;
  }

  return false;
};

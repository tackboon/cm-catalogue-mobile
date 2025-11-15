export const jsonParse = (str: string): Object => {
  try {
    return JSON.parse(str);
  } catch (err) {
    return {};
  }
};

export const jsonStringify = (obj: Object): string => {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    return "";
  }
};

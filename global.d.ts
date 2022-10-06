declare module "*.png" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "*.gif" {
  const value: import("react-native").ImageSourcePropType;
  export default value;
}

declare module "@env" {
  export const REACT_APP_FIREBASE_API_KEY: string;
  export const REACT_APP_API_HOST: string;
  export const REACT_APP_BRAND_NAME: string;
}

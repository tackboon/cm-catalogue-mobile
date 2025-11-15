import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { hideAsync } from "expo-splash-screen";

import Setting from "./components/setting/setting.component";
import CategoryScreen from "./screens/category/category.component";
import ProductListScreen from "./screens/product-list/product_list.component";
import ProductScreen from "./screens/product/product.component";
import SettingScreen from "./screens/setting/setting.component";
import SignInScreen from "./screens/sign-in/sign_in.component";
import LogoHeader from "./components/logo-header/logo-header.component";
import Logo from "../assets/logo.png";

import { api } from "./service/openapi/openapi.service";
import { Colors } from "./constants/styles";
import { sqlite } from "./service/sqlite/sqlite_service";
import { jsonParse } from "./utils/json/json.util";
import { VersionDataGuard } from "./store/data/data.types";
import { setVersion } from "./store/data/data.action";

export type StackParam = {
  Category: undefined;
  ProductList: { category_id: number; header_name: string };
  Product: { product_id: number; header_name: string };
  Settings: undefined;
  SignIn: undefined;
};

export type StackNavigation = NativeStackNavigationProp<StackParam>;

const Stack = createNativeStackNavigator<StackParam>();

const Main = () => {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);
  const brandName = process.env.EXPO_PUBLIC_BRAND_NAME.replace(/_/g, " ") || "CM Catalogue";

  useEffect(() => {
    const prepare = async () => {
      try {
        // setup custom axios
        api.setAxiosConfig();

        // get previous version
        const versionData = await AsyncStorage.getItem("version");
        if (versionData) {
          const version = jsonParse(versionData);
          let dbVersion = 0;
          let fileVersion = 0;

          if (VersionDataGuard(version)) {
            dbVersion = version.dbVersion;
            fileVersion = version.fileVersion;
          }

          dispatch(setVersion(dbVersion, fileVersion));
        }

        // db initialization
        await sqlite.initDB();
      } catch (err) {
        console.warn("initialization failed...");
        console.warn(err);
      } finally {
        setAppIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Category"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.warning,
          },
          animation: "slide_from_left",
        }}
      >
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{
            headerTitle: () => <LogoHeader logo={Logo} title={brandName} />,
            headerRight: () => <Setting />,
          }}
        />
        <Stack.Screen
          name="ProductList"
          component={ProductListScreen}
          options={({ route }) => ({ title: route.params.header_name })}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={({ route }) => ({ title: route.params.header_name })}
        />
        <Stack.Screen
          name="Settings"
          component={SettingScreen}
          options={{
            animation: "slide_from_right",
          }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ title: "Sign In", animation: "fade_from_bottom" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;

import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { preventAutoHideAsync } from "expo-splash-screen";

import { store } from "./store/store";
import Main from "./Main";

preventAutoHideAsync();

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Provider store={store}>
        <Main />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

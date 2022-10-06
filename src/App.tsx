import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { preventAutoHideAsync } from "expo-splash-screen";

import { store } from "./store/store";
import Main from "./Main";

preventAutoHideAsync();

const App = () => {
  return (
    <>
      <StatusBar style="auto" />
      <Provider store={store}>
        <Main />
      </Provider>
    </>
  );
};

export default App;

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { StackNavigation } from "../../Main";
import LoadingButton from "../../components/loading-button/loading_button.component";
import { Colors } from "../../constants/styles";
import { AppDispatch } from "../../store/store";
import { signOutStartAsync } from "../../store/user/user.action";
import { selectCurrentUser } from "../../store/user/user.selector";
import { updateDataStartAsync } from "../../store/data/data.action";
import { selectDataIsLoading } from "../../store/data/data.selector";
import { DATA_LOADING_TYPES } from "../../store/data/data.types";

const SettingScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigation>();
  const currentUser = useSelector(selectCurrentUser);
  const { [DATA_LOADING_TYPES.UPDATE_DATA]: updateIsLoading } =
    useSelector(selectDataIsLoading);

  useEffect(() => {
    if (!currentUser) {
      navigation.replace("SignIn");
    }
  }, [currentUser]);

  const handleUpdate = () => {
    dispatch(updateDataStartAsync());
  };

  const handleSignOut = () => {
    dispatch(signOutStartAsync());
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoWrapper}>
        <View style={styles.info}>
          <Text style={styles.label}>Email: </Text>
          <Text style={styles.bold}>{currentUser?.email}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.bold}>{currentUser?.displayName}</Text>
        </View>
      </View>

      <View>
        <LoadingButton
          title="UPDATE"
          loadingTitle="UPDATING..."
          isLoading={updateIsLoading}
          onPress={handleUpdate}
        />

        <TouchableHighlight
          style={[styles.btn, styles.signout]}
          underlayColor={Colors.dangerLight}
          onPress={handleSignOut}
        >
          <Text style={styles.btnText}>SIGN OUT</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  infoWrapper: {
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  info: {
    paddingVertical: 10,
    flexDirection: "row",
  },
  label: {
    fontSize: 16,
    width: 64,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },
  btn: {
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff" },
  signout: {
    backgroundColor: Colors.danger,
  },
});

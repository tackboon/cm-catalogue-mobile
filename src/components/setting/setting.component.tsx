import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import Entypo from "@react-native-vector-icons/entypo";

import { StackNavigation } from "../../Main";
import { Colors } from "../../constants/styles";

const Setting = () => {
  const navigation = useNavigation<StackNavigation>();

  const handlePressSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <Pressable onPress={handlePressSettings}>
      <View style={styles.settingWrapper}>
        <Entypo name="dots-three-vertical" style={styles.settingIcon} />
      </View>
    </Pressable>
  );
};

export default Setting;

const styles = StyleSheet.create({
  settingWrapper: {
    height: 50,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  settingIcon: {
    fontSize: 24,
    color: Colors.secondary,
  },
});

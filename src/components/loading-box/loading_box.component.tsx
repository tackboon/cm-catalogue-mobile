import { FC } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import DualRing from "../../../assets/dual-ring.gif";

type LoadingBoxProp = {
  show: boolean;
  title: string;
};

const LoadingBox: FC<LoadingBoxProp> = ({ show, title }) => {
  return (
    <View style={[styles.container, { display: show ? "flex" : "none" }]}>
      <View style={styles.dialog}>
        <Image source={DualRing} style={styles.loading} />
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default LoadingBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    position: "absolute",
    zIndex: 2,
    height: "100%",
    width: "100%",
  },
  dialog: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 280,
    width: 280,
    borderRadius: 30,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    elevation: 8,
  },
  title: {
    fontWeight: "500",
    fontSize: 18,
    paddingVertical: 15,
  },
  loading: {
    height: 200,
    width: 200,
  },
});

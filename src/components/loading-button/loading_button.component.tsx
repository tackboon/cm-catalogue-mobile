import { FC } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from "react-native";

import { Colors } from "../../constants/styles";

type LoadingButtonProps = {
  title: string;
  loadingTitle: string;
  isLoading: boolean;
  backgroundColor?: string;
  color?: string;
  underlayColor?: string;
} & TouchableHighlightProps;

const LoadingButton: FC<LoadingButtonProps> = ({
  title,
  loadingTitle,
  isLoading,
  backgroundColor,
  underlayColor,
  color,
  ...props
}) => (
  <TouchableHighlight
    disabled={isLoading ? true : false}
    {...props}
    style={[
      styles.button,
      { opacity: isLoading ? 0.5 : 1 },
      { backgroundColor: backgroundColor ? backgroundColor : Colors.primary },
    ]}
    underlayColor={underlayColor ? underlayColor : Colors.primaryLight}
  >
    <View style={styles.inner}>
      <Text style={{ color: color ? color : "#fff" }}>
        {isLoading ? <>{loadingTitle}</> : title}
      </Text>
      {isLoading && <ActivityIndicator color={color ? color : "#fff"} />}
    </View>
  </TouchableHighlight>
);

export default LoadingButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginTop: 30,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
  },
});

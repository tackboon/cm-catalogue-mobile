import { FC } from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

type LogoHeaderProps = {
  logo: ImageSourcePropType;
  title: string;
};

const LogoHeader: FC<LogoHeaderProps> = ({ logo, title }) => {
  return (
    <View style={styles.brandWrapper}>
      <Image style={styles.logo} source={logo} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

export default LogoHeader;

const styles = StyleSheet.create({
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginLeft: 5,
  },
  title: {
    fontSize: 19,
    fontWeight: "500",
  },
});

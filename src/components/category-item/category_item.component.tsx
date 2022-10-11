import { FC } from "react";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { CategoryData } from "../../store/category/category.types";
import { StackNavigation } from "../../Main";
import CustomImage from "../custom-image/custom_image.component";

type CategoryItemProps = {
  category: CategoryData;
};

const deviceWidth = Dimensions.get("window").width;

const CategoryItem: FC<CategoryItemProps> = ({ category }) => {
  const navigation = useNavigation<StackNavigation>();

  const handlePress = () => {
    navigation.navigate("ProductList", {
      category_id: category.id,
      header_name: category.name,
    });
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <CustomImage fileID={category.file_id} style={styles.image} />
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
        {category.name}
      </Text>
    </Pressable>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth >= 576 ? 270 : 320,
    height: deviceWidth >= 576 ? 255 : 256,
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    overflow: "hidden",
    marginVertical: 24,
    marginHorizontal: deviceWidth >= 576 ? (deviceWidth - 540) / 4 : 0,
  },
  image: {
    height: 200,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    paddingTop: 12,
    paddingHorizontal: 12,
  },
});

import { useEffect } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { AppDispatch } from "../../store/store";
import { getCategoryStartAsync } from "../../store/category/category.action";
import { selectCategories } from "../../store/category/category.selector";
import CategoryItem from "../../components/category-item/category_item.component";

const deviceWidth = Dimensions.get("window").width;

const CategoryScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isFocused = useIsFocused();
  const categories = useSelector(selectCategories);

  useEffect(() => {
    if (isFocused) {
      dispatch(getCategoryStartAsync());
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({ item }) => <CategoryItem category={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={deviceWidth >= 576 ? 2 : 1}
        contentContainerStyle={styles.wrapper}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 16,
    alignItems: "center",
  },
  wrapper: {
    width: deviceWidth,
    alignItems: "center",
  },
});

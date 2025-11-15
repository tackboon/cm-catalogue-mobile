import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StackParam } from "../../Main";
import { AppDispatch } from "../../store/store";
import { getProductStartAsync } from "../../store/product/product.action";
import { selectProducts } from "../../store/product/product.selector";
import {
  isProductStatus,
  ProductStatus,
} from "../../store/product/product.types";
import { Colors } from "../../constants/styles";
import ProductItem from "../../components/product-item/product_item.component";
import SearchBar from "../../components/search-bar/search_bar.component";

const deviceWidth = Dimensions.get("window").width;

const ProductListScreen = () => {
  const route = useRoute<RouteProp<StackParam, "ProductList">>();
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus>("all");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    dispatch(
      getProductStartAsync({
        category_id: route.params.category_id,
        filter: filter,
        status: selectedStatus,
      })
    );
  }, [selectedStatus, filter]);

  const handleStatusChange = async (value: ProductStatus) => {
    setSelectedStatus(value);
    await AsyncStorage.setItem("product_status", value);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      const status = await AsyncStorage.getItem("product_status");
      if (status && isProductStatus(status)) setSelectedStatus(status);
    };
    fetchStatus();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.optionWrapper}>
        <SearchBar
          placeholder="Search item here..."
          onSearch={(value: string) => setFilter(value)}
        />

        <View style={styles.dropdownWrapper}>
          <Picker
            mode="dropdown"
            style={styles.dropdown}
            selectedValue={selectedStatus}
            onValueChange={(value: ProductStatus) => handleStatusChange(value)}
          >
            <Picker.Item label="All Products" value="all" />
            <Picker.Item label="In Stock - 有库存" value="in_stock" />
            <Picker.Item label="Out Of Stock - 无库存" value="out_of_stock" />
          </Picker>
        </View>
      </View>

      <FlatList
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={deviceWidth >= 576 ? 2 : 1}
        contentContainerStyle={styles.wrapper}
      />
    </View>
  );
};

export default ProductListScreen;

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
  optionWrapper: {
    width: "100%",
    paddingBottom: 16,
    paddingHorizontal: 8,
  },
  dropdownWrapper: {
    width: "100%",
    borderColor: Colors.secondaryLight,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
  },
  dropdown: {
    width: "100%",
  },
});

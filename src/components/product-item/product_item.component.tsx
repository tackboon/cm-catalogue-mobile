import { FC, useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import { ProductData } from "../../store/product/product.types";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../Main";
import ImageSwiper from "../image-swiper/image_swiper.component";

type ProductItemProps = {
  product: ProductData;
};

const deviceWidth = Dimensions.get("window").width;

const ProductItem: FC<ProductItemProps> = ({ product }) => {
  const navigation = useNavigation<StackNavigation>();
  const [fileIDs, setFileIDs] = useState<string[]>([]);

  useEffect(() => {
    const ids = product.files.map((file) => file.file_id);

    if (product.preview_id !== "") {
      const index = ids.indexOf(product.preview_id);
      if (index > -1) {
        ids.splice(index, 1);
        ids.unshift(product.preview_id);
      }
    }

    setFileIDs(ids);
  }, [product.preview_id, product.files]);

  const handlePress = () => {
    navigation.navigate("Product", {
      product_id: product.id,
      header_name: product.name,
    });
  };

  return (
    <View style={styles.container}>
      <ImageSwiper
        fileIDs={fileIDs}
        style={styles.image}
        onPress={handlePress}
      />
      <Pressable style={styles.info} onPress={handlePress}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.small}>price: RM {product.price.toFixed(2)}</Text>
        <Text style={styles.small}>
          status:{" "}
          <Text
            style={
              product.status === "out_of_stock"
                ? { color: Colors.danger }
                : null
            }
          >
            {product.status}
          </Text>
        </Text>
      </Pressable>
    </View>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    width: deviceWidth >= 576 ? 270 : 320,
    height: 400,
    backgroundColor: "#fff",
    borderRadius: 18,
    elevation: 3,
    overflow: "hidden",
    marginVertical: 24,
    marginHorizontal: deviceWidth >= 576 ? (deviceWidth - 540) / 4 : 0,
  },
  image: {
    width: deviceWidth >= 576 ? 270 : 320,
    height: 200,
  },
  info: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.secondaryLight,
    marginBottom: 16,
    height: 60,
  },
  small: {
    fontSize: 14,
    marginBottom: 8,
  },
});

import { RouteProp, useRoute } from "@react-navigation/native";
import { Paths } from "expo-file-system";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { useSelector } from "react-redux";

import CustomImage from "../../components/custom-image/custom_image.component";
import { Colors } from "../../constants/styles";
import { StackParam } from "../../Main";
import { selectProductByID } from "../../store/product/product.selector";
import { RootState } from "../../store/store";
import NoImage from "../../../assets/no-photo-available.png";

type ImageViewerProps = {
  url: string;
};

const deviceWidth = Dimensions.get("window").width;

const ProductScreen = () => {
  const route = useRoute<RouteProp<StackParam, "Product">>();
  const product = useSelector((state: RootState) =>
    selectProductByID(state, route.params.product_id)
  );
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState<ImageViewerProps[]>([]);

  useEffect(() => {
    const urls = product.files.map((file) => ({
      url: Paths.document.uri + "file/file/file-data/" + file.file_id,
    }));
    setImages(urls);
  }, [product.files]);

  const handlePress = (index: number) => {
    setImageIndex(index);
    setShowImageViewer(true);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Product Name:</Text> {product?.name}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Description:</Text>{" "}
          {product?.description}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Price:</Text> RM{" "}
          {(product?.price || 0).toFixed(2)}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.infoLabel}>Status:</Text>{" "}
          <Text
            style={
              product?.status === "out_of_stock"
                ? { color: Colors.danger }
                : null
            }
          >
            {product?.status}
          </Text>
        </Text>
      </View>

      <View style={styles.imageContainer}>
        {product.files.map((file, index) => (
          <Pressable
            onPress={() => handlePress(index)}
            style={styles.imageWrapper}
            key={file.file_id}
          >
            <CustomImage fileID={file.file_id} style={styles.image} />
          </Pressable>
        ))}
      </View>

      <Modal
        visible={showImageViewer}
        onRequestClose={() => setShowImageViewer(false)}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.backWrapper}
            onPress={() => setShowImageViewer(false)}
          >
            <Text style={styles.back}>&lt;</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ImageViewer
          imageUrls={images}
          index={imageIndex}
          failImageSource={{ url: "", props: { source: NoImage } }}
        />
      </Modal>
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: "#000",
  },
  backWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  back: {
    fontSize: 24,
    marginRight: 8,
    color: "#fff",
  },
  backText: {
    fontSize: 16,
    color: "#fff",
  },
  infoContainer: {
    padding: 16,
  },
  info: {
    paddingTop: 8,
    fontSize: 16,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  imageContainer: {
    width: deviceWidth,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    elevation: 3,
    marginVertical: 16,
    marginHorizontal: deviceWidth >= 576 ? (deviceWidth - 540) / 4 : 0,
    backgroundColor: "#fff",
  },
  image: {
    width: deviceWidth >= 576 ? 270 : 320,
    height: 200,
  },
});

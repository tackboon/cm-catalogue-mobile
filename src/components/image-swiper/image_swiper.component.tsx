import { FlatList, ImageStyle, Pressable, StyleProp } from "react-native";
import { FC } from "react";
import CustomImage from "../custom-image/custom_image.component";

type ImageSwiperProps = {
  fileIDs: string[];
  style?: StyleProp<ImageStyle>;
  onPress?: (id: string) => void;
};

const ImageSwiper: FC<ImageSwiperProps> = ({ fileIDs, style, onPress }) => {
  return (
    <FlatList
      data={fileIDs}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            if (onPress) onPress(item);
          }}
        >
          <CustomImage fileID={item} style={style} />
        </Pressable>
      )}
      keyExtractor={(item) => item}
      horizontal={true}
    />
  );
};

export default ImageSwiper;

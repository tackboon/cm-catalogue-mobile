import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from "react-native";
import { FC, useEffect, useState } from "react";

import NoImage from "../../../assets/no-photo-available.png";
import { documentDirectory } from "expo-file-system";

type CustomImageProps = {
  fileID: string;
  style?: StyleProp<ImageStyle>;
};

const CustomImage: FC<CustomImageProps> = ({ fileID, style }) => {
  const [image, setImage] = useState<ImageSourcePropType>();

  useEffect(() => {
    const filePath = documentDirectory + "/file/file/file-data/" + fileID;
    setImage({ uri: filePath });
  }, [fileID]);

  return (
    <Image
      style={style}
      source={image}
      resizeMode="cover"
      onError={() => setImage(NoImage)}
    />
  );
};

export default CustomImage;

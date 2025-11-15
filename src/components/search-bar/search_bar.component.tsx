import { FC, useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import debounce from "lodash.debounce";
import Entypo from "@react-native-vector-icons/entypo";

import { Colors } from "../../constants/styles";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

const SearchBar: FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [value, setValue] = useState("");

  // auto search after 500ms of input changed
  const debounceSearch = useRef(
    debounce((criteria: string) => {
      onSearch(criteria);
    }, 500)
  ).current;

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  const handleChange = (value: string) => {
    setValue(value);
    debounceSearch(value);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        value={value}
        placeholder={placeholder}
      />
      <Entypo name="magnifying-glass" style={styles.searchIcon} />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    height: 50,
    padding: 16,
    borderRadius: 8,
  },
  searchIcon: {
    fontSize: 30,
    color: "rgba(0,0,0,0.4)",
    position: "absolute",
    top: 10,
    right: 10,
  },
});

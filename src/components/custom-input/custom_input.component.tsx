import { FC } from "react";
import { KeyboardType, StyleSheet, Text, TextInput, View } from "react-native";

type CustomInputProps = {
  label: string;
  keyboardType: KeyboardType;
  value: string;
  secure?: boolean;
  placeholder?: string;
  onUpdateValue: (value: string) => void;
};

const CustomInput: FC<CustomInputProps> = ({
  label,
  keyboardType,
  value,
  secure = false,
  placeholder,
  onUpdateValue,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      autoCapitalize="none"
      keyboardType={keyboardType}
      secureTextEntry={secure}
      onChangeText={onUpdateValue}
      value={value}
      placeholder={placeholder}
    />
  </View>
);

export default CustomInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    color: "#000",
    marginBottom: 4,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    elevation: 4,
  },
});

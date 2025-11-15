import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StackNavigation } from "../../Main";
import LoadingButton from "../../components/loading-button/loading_button.component";
import CustomInput from "../../components/custom-input/custom_input.component";
import { Colors } from "../../constants/styles";
import {
  emailSignInStartAsync,
  getUserInfoAsync,
  resetUserError,
} from "../../store/user/user.action";
import { AppDispatch } from "../../store/store";
import {
  selectCurrentUser,
  selectUserError,
  selectUserIsLoading,
} from "../../store/user/user.selector";
import {
  USER_ERROR_TYPES,
  USER_LOADING_TYPES,
} from "../../store/user/user.types";
import LoadingBox from "../../components/loading-box/loading_box.component";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInScreen = () => {
  const navigation = useNavigation<StackNavigation>();

  const { [USER_ERROR_TYPES.SIGN_IN]: signInError } =
    useSelector(selectUserError);
  const { [USER_LOADING_TYPES.SIGN_IN]: signInLoading } =
    useSelector(selectUserIsLoading);
  const currentUser = useSelector(selectCurrentUser);

  const dispatch = useDispatch<AppDispatch>();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const handleInputChange = (field: string, value: string) => {
    setFormFields({ ...formFields, [field]: value });
  };

  const handleSubmit = async () => {
    dispatch(emailSignInStartAsync({ email, password }));
  };

  useEffect(() => {
    if (currentUser) {
      navigation.replace("Settings");
    }
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token && token !== "") {
          dispatch(getUserInfoAsync(token));
        }
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const lastSignInEmail = await AsyncStorage.getItem("lastSignInEmail");
        if (lastSignInEmail && lastSignInEmail.trim() !== "") {
          setFormFields({ ...formFields, ["email"]: lastSignInEmail });
        }
      } catch (error) {}
    })();

    return () => {
      dispatch(resetUserError(USER_ERROR_TYPES.SIGN_IN));
    };
  }, []);

  return (
    <>
      <LoadingBox show={signInLoading} title="Signing In..." />
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <CustomInput
              label="Email Address"
              keyboardType="email-address"
              value={email}
              placeholder="abc@example.com"
              onUpdateValue={handleInputChange.bind(this, "email")}
            />

            <CustomInput
              label="Password"
              keyboardType="default"
              value={password}
              secure={true}
              placeholder="Must have at least 6 characters"
              onUpdateValue={handleInputChange.bind(this, "password")}
            />

            <Text style={styles.error}>{signInError}</Text>

            <LoadingButton
              title="SIGN IN"
              loadingTitle="SIGNING IN..."
              isLoading={signInLoading}
              onPress={handleSubmit}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  error: {
    marginVertical: 10,
    color: Colors.danger,
  },
});

import axios from "axios";

enum FIREBASE_AUTH_MODE {
  SIGN_IN_WITH_PASSWORD = "signInWithPassword",
}

type AuthenticateParams = {
  mode: FIREBASE_AUTH_MODE;
  email: string;
  password: string;
};

const authenticate = async ({ mode, email, password }: AuthenticateParams) => {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "";
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${apiKey}`;

  return await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });
};

export const signInUserWithEmailAndPassword = async (
  email: string,
  password: string
) =>
  await authenticate({
    mode: FIREBASE_AUTH_MODE.SIGN_IN_WITH_PASSWORD,
    email,
    password,
  });

export type AuthError = {
  error: {
    code: number;
    message: string;
  };
};

export const firebaseAuthError = (error: AuthError): string => {
  let errorMessage = "";

  switch (error.error.message) {
    case "INVALID_EMAIL":
      errorMessage = "Please provide a valid email.";
      break;
    case "USER_DISABLED":
      errorMessage = "User account has been disabled.";
      break;
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
      errorMessage =
        "Password is invalid for given email. Please double check the email and password again.";
      break;
    default:
      errorMessage = "Authentication Error!";
  }

  return errorMessage;
};

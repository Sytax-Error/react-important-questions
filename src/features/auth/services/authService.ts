import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../../../services/firebase/config";

export interface AuthError {
  code: string;
  message: string;
}

export function mapAuthError(error: unknown): AuthError {
  if (error && typeof error === "object" && "code" in error) {
    const firebaseError = error as { code: string; message?: string };
    const code = firebaseError.code;

    switch (code) {
      case "auth/invalid-email":
        return { code, message: "Please enter a valid email address" };
      case "auth/user-disabled":
        return {
          code,
          message: "This account has been disabled. Contact support.",
        };
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return {
          code,
          message: "Invalid email or password. Please try again.",
        };
      case "auth/too-many-requests":
        return {
          code,
          message: "Too many failed attempts. Please try again later.",
        };
      case "auth/network-request-failed":
        return {
          code,
          message: "Network error. Please check your connection.",
        };
      case "auth/operation-not-allowed":
        return {
          code,
          message: "Email/password sign-in is not enabled. Contact support.",
        };
      case "auth/popup-closed-by-user":
        return { code, message: "Sign-in was cancelled." };
      case "auth/cancelled-popup-request":
        return { code, message: "Sign-in was cancelled." };
      default:
        return {
          code,
          message:
            firebaseError.message ||
            "An unexpected error occurred. Please try again.",
        };
    }
  }

  return {
    code: "unknown",
    message: "An unexpected error occurred. Please try again.",
  };
}

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<{ user: User }> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return { user: userCredential.user };
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthStateChange = (
  callback: (user: User | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

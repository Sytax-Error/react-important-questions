import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./config";

export const loginWithEmail = async (
  email: string,
  password: string,
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthStateChange = (
  callback: (user: User | null) => void,
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };

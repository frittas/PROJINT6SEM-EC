import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // console.log("USUARIO LOGADO >>>", user);
    return user;
  } catch (error: any) {
    // console.log(error.message);
    throw error;
  }
};
const signUp = async (email: string, password: string, name: string) => {
  try {
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser.user, {
      displayName: name,
    });
  } catch (e) {
    throw e;
  }
};

const signOut = async () => {
  return await auth.signOut();
};

const lostPass = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};
export { signIn, signUp, signOut, lostPass };

import { signInWithEmailAndPassword } from "firebase/auth";
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
const signUp = async () => {};
const signOut = async () => {
  return await auth.signOut();
};
export { signIn, signUp, signOut };

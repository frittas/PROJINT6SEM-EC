// services/authService.js
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { firebaseApp } = require("../firebaseConfig");

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

class AuthService {
  async registerUser(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new AuthService();

// firebaseConfig.js
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Inicialize o Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp); // Certifique-se de que isto retorna uma instância Firestore

module.exports = { db }; // Exporta `db` para uso em outros arquivos


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
} = require("firebase/firestore");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração Firebase
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Inicializacao do Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Rota de Cadastro
app.post("/cadastro", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    res
      .status(201)
      .json({ message: "Usuario cadastrado!", user: userCredential.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota de Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    res
      .status(200)
      .json({ message: "Login realizado", user: userCredential.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Rota de Localizacoes
app.post("/locations", async (req, res) => {
  const { uid, title, latitude, longitude } = req.body;

  // Validar entrada
  if (!uid || !title || !latitude || !longitude) {
    return res.status(400).json({
      message: "Insira todos os valores!",
    });
  }

  try {
    // Referência à subcoleção `locations` dentro do documento do usuário
    const userLocationsRef = collection(db, `users/${uid}/locations`);

    // Adicionar a nova localização com título
    const newLocationRef = await addDoc(userLocationsRef, {
      title,
      latitude,
      longitude,
      createdAt: new Date(), // Adiciona a data de criação
    });

    res.status(201).json({
      message: "Localização adicionada",
      locationId: newLocationRef.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando => http://localhost:${PORT}`);
});

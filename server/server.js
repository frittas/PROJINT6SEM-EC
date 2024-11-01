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
  GeoPoint,
} = require("firebase/firestore");
const geofirestore = require('geofirestore'); // Importar o geofirestore

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

const GeoFirestore = geofirestore.initializeApp(db);

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

//Rota para adicionar localizacoes
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

//Rota para adicionar geopoints
app.post("/geopoint", async (req, res) => {
  const { uid, title, latitude, longitude } = req.body;

  // Validar entrada
  if (!uid || !title || !latitude || !longitude) {
    return res.status(400).json({
      message: "Insira todos os valores!",
    });
  }

  try {
    // Adicionar a nova localização com título
    const newLocationRef = await addDoc(collection(db, "locations"), {
      uid,
      title,
      location: new GeoPoint(latitude, longitude),
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Localização adicionada",
      locationId: newLocationRef.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////////////////////////////////////

// // Rota para buscar localizações dentro de um raio
// const firestore = firebase.firestore();
// //const geofirestore = require('geofirestore');
// const GeoFirestore = geofirestore.initializeApp(firestore); // Inicializar o GeoFirestore com a sua referência do Firestore
// Importar o GeoFirestore


// Inicializar o GeoFirestore com a referência do Firestore
//const firestore = getFirestore(firebaseApp); // Obter a referência do Firestore corretamente
//const geoFirestore = new GeoFirestore(firestore); // Inicializar o GeoFirestore

app.post("/geofirestore", async (req, res) => {
  const { latitude, longitude, radius } = req.body;

  // Validar entrada
  if (!latitude || !longitude || !radius) {
    return res.status(400).json({
      message: "Insira latitude, longitude e raio!",
    });
  }

  try {
    // Criar uma referência à coleção de localizações
    const geoCollectionRef = GeoFirestore.collection('locations');

    // Consultar as localizações dentro do raio especificado
    const query = geoCollectionRef.near({
      center: new GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      radius: parseFloat(radius)
    });
    
    const snapshot = await query.get();

    // Extrair os dados das localizações
    const locations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando => http://localhost:${PORT}`);
});
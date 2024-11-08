require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importação do Firebase compatível
const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");

// Bibliotecas adicionais para GeoFirestore
const { GeoFirestore, GeoCollectionReference } = require("geofirestore");

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

// Inicialização do Firebase usando compat
const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Inicialização do GeoFirestore com o Firestore
const geofirestore = new GeoFirestore(db);
const locationsCollection = geofirestore.collection("locations"); // Coleção geoespacial

// Rota GeoFire para consulta de localização
app.get("/search-locations", async (req, res) => {
    try {
      // Parâmetros recebidos do frontend
      const { latitude, longitude, radius } = req.query;
      console.log("Parâmetros recebidos:", { latitude, longitude, radius });
  
      // Verifica se todos os parâmetros foram passados
      if (!latitude || !longitude || !radius) {
        return res.status(400).send("Parâmetros latitude, longitude e radius são obrigatórios.");
      }
      
      // Define o ponto central como um GeoPoint e converte o raio para número
      const center = new firebase.firestore.GeoPoint(parseFloat(latitude), parseFloat(longitude));
      console.log("Centro da busca:", center);
      
      // Realiza a consulta para buscar documentos dentro do raio
      const query = locationsCollection.near({
        center,
        radius: parseFloat(radius) // raio em km
      });
  
      // Executa a consulta e extrai os documentos
      const querySnapshot = await query.get();
      const locations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Retorna as localizações encontradas
      return res.status(200).json({ locations });
    } catch (error) {
      console.error("Erro ao buscar localizações:", error);
      return res.status(500).send("Erro ao buscar localizações.");
    }
  });
  

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando => http://localhost:${PORT}`);
});

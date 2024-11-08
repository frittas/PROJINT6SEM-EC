require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore, collection, query, where, GeoPoint, getDocs } = require("firebase/firestore");
const { Expo } = require("expo-server-sdk");

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

// Inicialização do Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

//////////////////////////////////////////////////////////////////////////////////
// FUNÇÕES

// Função para calcular distância entre dois pontos em km (usando a fórmula de Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Função para buscar locais próximos dentro do raio e filtrar por UID único
async function buscarLocaisProximos(lat, lng, radius) {
  const kmPerDegreeLat = 110.574;
  const kmPerDegreeLng = 111.32 * Math.cos((lat * Math.PI) / 180);

  const latMin = lat - radius / kmPerDegreeLat;
  const latMax = lat + radius / kmPerDegreeLat;
  const lngMin = lng - radius / kmPerDegreeLng;
  const lngMax = lng + radius / kmPerDegreeLng;

  const usuariosUnicos = new Set();

  try {
    const q = query(
      collection(db, "locations"),
      where("location", ">=", new GeoPoint(latMin, lngMin)),
      where("location", "<=", new GeoPoint(latMax, lngMax))
    );

    const querySnapshot = await getDocs(q); //pode acessar cada documento retornado para pegar os dados que precisa.

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const localLat = data.location.latitude;
      const localLng = data.location.longitude;

      const distancia = haversineDistance(lat, lng, localLat, localLng); 
      if (distancia <= radius) {
        usuariosUnicos.add(data.uid); //encontra os usuarios dentro do raio.
      }
    });

    return Array.from(usuariosUnicos);// retorna os usuarios encontrados.
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
  }
}

// Função para buscar pushTokens dos UIDs encontrados e agrupar por usuário.
async function buscarPushTokens(uids) {
  const tokensPorUsuario = {};

  try {
    const q = query(
      collection(db, "pushTokens"),
      where("uid", "in", uids)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const uid = data.uid;
      const pushToken = data.token;

      if (tokensPorUsuario[uid]) { //pegando os tokens dos uids dentro do array.
        tokensPorUsuario[uid].push(pushToken);
      } else {
        tokensPorUsuario[uid] = [pushToken];
      }
    });

    return tokensPorUsuario;
  } catch (error) {
    console.error("Erro ao buscar pushTokens:", error);
  }
}

// Função para enviar notificações usando o Expo
async function enviarNotificacao(pushTokens, mensagem) {
  const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN, useFcmV1: true });

  let messages = pushTokens.map(token => ({ //configuracoes das mensagens.
    to: token,
    sound: "default",
    body: mensagem,
    data: { withSome: "data" },
  }));

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("Erro ao enviar notificação:", error);
    }
  }

  let receiptIds = tickets.filter(ticket => ticket.id).map(ticket => ticket.id);
  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);

      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === "error") {
          console.error(`Erro ao enviar notificação: ${message}`);
          if (details && details.error) console.error(`Código de erro: ${details.error}`);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar recibos:", error);
    }
  }
}

// Atualização na rota `/push` para o fluxo completo
app.post("/push", async (req, res) => {
  const { message, title, latitude, longitude, radius } = req.body;

  if (!message || !title || !latitude || !longitude || !radius) {
    return res.status(400).json({ message: "Insira todos os valores!" });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    const usuariosEncontrados = await buscarLocaisProximos(lat, lng, rad);

    if (usuariosEncontrados.length > 0) {
      const tokensPorUsuario = await buscarPushTokens(usuariosEncontrados); //envia a notificacao
      for (const uid in tokensPorUsuario) {
        const tokens = tokensPorUsuario[uid];
        const tokensValidos = tokens.filter(token => Expo.isExpoPushToken(token));
        if (tokensValidos.length > 0) {
          await enviarNotificacao(tokensValidos, message);
        } else {
          console.log(`Nenhum token válido para o usuário ${uid}`);
        }
      }
      res.json({ success: true, message: "Notificações enviadas" });
    } else {
      res.json({ success: true, message: "Nenhum usuário encontrado dentro do raio" });
    }
  } catch (error) {
    console.error("Erro ao processar a solicitação:", error);
    res.status(500).json({ message: "Erro ao processar a solicitação." });
  }
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando => http://localhost:${PORT}`);
});

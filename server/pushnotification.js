require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} = require("firebase/auth");
const {
  getFirestore,
  collection,
  query,
  where,
  doc,
  getDocs,
  setDoc,
  addDoc,
  GeoPoint
} = require("firebase/firestore");
const { Expo } = require("expo-server-sdk"); // Mudar para desestruturação

const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests from this origin
  methods: ['GET', 'POST'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'],  // Allow headers like Content-Type
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

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
async function buscarLocaisProximos(lat, lng, radius, title, message) {
  const kmPerDegreeLat = 110.574;
  const kmPerDegreeLng = 111.32 * Math.cos((lat * Math.PI) / 180);

  const latMin = lat - radius / kmPerDegreeLat;
  const latMax = lat + radius / kmPerDegreeLat;
  const lngMin = lng - radius / kmPerDegreeLng;
  const lngMax = lng + radius / kmPerDegreeLng;

  const usuariosUnicos = new Set();

  const locationsRef = collection(db, "locations");
  const q = query(
    locationsRef,
    where("location", ">=", new GeoPoint(latMin, lngMin)),
    where("location", "<=", new GeoPoint(latMax, lngMax))
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const localLat = data.location.latitude;
    const localLng = data.location.longitude;

    const distancia = haversineDistance(lat, lng, localLat, localLng);

    if (distancia <= radius) {
      usuariosUnicos.add(data.uid);
    }
  });

  const usuariosArray = Array.from(usuariosUnicos);

  if (usuariosArray.length > 0) {
    console.log(
      `Usuários encontrados dentro do raio: ${usuariosArray.join(", ")}`
    );
    buscarPushTokens(usuariosArray, title, message);
  } else {
    console.log("Nenhum usuário encontrado dentro do raio");
  }

  return usuariosArray;
}

// Função para buscar pushTokens dos UIDs encontrados e agrupar por usuário
function buscarPushTokens(uids, title, message) {
  if (uids.length === 0) {
    console.log("Nenhum usuário encontrado.");
    return;
  }

  console.log(`Buscando pushTokens para os UIDs:`, uids);

  // Criar um objeto para agrupar os tokens por UID
  const tokensPorUsuario = {};

  // Criar uma consulta para a coleção pushTokens, filtrando pelos UIDs
  const pushTokensRef = collection(db, "pushTokens");
  const q = query(pushTokensRef, where("uid", "in", uids)); // Define a consulta

  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const uid = data.uid;
        const pushToken = data.token; // Assumindo que o campo token contém o pushToken

        // Se o UID já existe no objeto, adicionar o token
        if (tokensPorUsuario[uid]) {
          tokensPorUsuario[uid].push(pushToken);
        } else {
          // Se for o primeiro token do usuário, criar uma nova lista de tokens
          tokensPorUsuario[uid] = [pushToken];
        }
      });
      // Exibir os usuários e seus tokens no console
      for (const uid in tokensPorUsuario) {
        const tokens = tokensPorUsuario[uid];
        console.log(
          `Usuário encontrado: ${uid}. Tokens: ${tokens.join(" - ")}`
        );

        // Filtrar apenas tokens válidos antes de enviar
        const tokensValidos = tokens.filter((token) =>
          Expo.isExpoPushToken(token)
        );

        if (tokensValidos.length > 0) {
          // Chamar a função para enviar a notificação
          enviarNotificacao(tokensValidos, title, message);
        } else {
          console.log(`Nenhum token válido encontrado para o usuário ${uid}.`);
        }
      }

      if (Object.keys(tokensPorUsuario).length === 0) {
        console.log("Nenhum pushToken encontrado para os UIDs fornecidos.");
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar pushTokens:", error);
    });
}

// Função para enviar notificações usando o Expo
function enviarNotificacao(pushTokens, title, mensagem) {
  // Crie um novo cliente SDK do Expo
  let expo = new Expo({
    accessToken: process.env.EXPO_ACCESS_TOKEN,
    useFcmV1: true,
  });

  // Criar as mensagens que você deseja enviar aos clientes
  let messages = [];
  for (let pushToken of pushTokens) {
    // Construir a mensagem
    messages.push({
      to: pushToken,
      sound: "default",
      body: mensagem,
      title: title,
      data: { withSome: "data" },
    });
  }

  // Dividir as mensagens em chunks para enviar
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    // Enviar os chunks ao serviço de notificações push do Expo
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();

  // Lidar com os recibos de notificações enviadas
  let receiptIds = [];
  for (let ticket of tickets) {
    if (ticket.status === "ok") {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  (async () => {
    for (let chunk of receiptIdChunks) {
      try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        for (let receiptId in receipts) {
          let { status, message, details } = receipts[receiptId];
          if (status === "ok") {
            continue;
          } else if (status === "error") {
            console.error(
              `Houve um erro ao enviar uma notificação: ${message}`
            );
            if (details && details.error) {
              console.error(`O código de erro é ${details.error}`);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  })();
}

app.post("/push", async (req, res) => {
  const { message, title, latitude, longitude, radius } = req.body;
  // Validar entrada
  if (!message || !title || !latitude || !longitude || !radius) {
    return res.status(400).json({
      message: "Insira todos os valores!",
    });
  }

  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    const usuariosEncontrados = await buscarLocaisProximos(
      lat,
      lng,
      rad,
      title,
      message
    );

    if (usuariosEncontrados.length > 0) {
      res.json({ success: true, usuarios: usuariosEncontrados });
    } else {
      res.json({
        success: true,
        message: "Nenhum usuário encontrado dentro do raio",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar a solicitação.");
  }
});

// Iniciar Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando => http://localhost:${PORT}`);
});

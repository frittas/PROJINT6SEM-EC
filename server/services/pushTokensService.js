// services/pushTokenService.js
const { collection, query, where, getDocs } = require("firebase/firestore");
const db = require("../firebaseConfig").db; // Importando a instância Firestore configurada
const { enviarNotificacao } = require("./pushNotificationService");
const { Expo } = require("expo-server-sdk");

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

  module.exports = { buscarPushTokens };
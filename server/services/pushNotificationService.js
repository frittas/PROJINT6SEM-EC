// services/pushNotificationService.js
const { Expo } = require("expo-server-sdk");
//const ExpoPushToken = require("expo-server-sdk").ExpoPushToken;

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

module.exports = { enviarNotificacao };
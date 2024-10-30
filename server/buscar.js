// Importar o Firebase Admin SDK
const admin = require('firebase-admin');
const geopoint = require('./dados.js');
const { Expo } = require('expo-server-sdk'); // Mudar para desestruturação

// Inicializar o Firebase Admin SDK com o caminho fornecido
const serviceAccount = require('C:/Users/Pichau/Desktop/config/rams-bc25c-firebase-adminsdk-4vbvu-aa158e768d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Instanciar o Firestore
const db = admin.firestore();

// Função para calcular distância entre dois pontos em km (usando a fórmula de Haversine)
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Função para buscar locais próximos dentro de 5 km e filtrar por UID único
function buscarLocaisProximos(centroGeoPoint, raioKm = 5) {
    const lat = centroGeoPoint.latitude;
    const lng = centroGeoPoint.longitude;

    // Aproximação para 1 grau de latitude/longitude em km
    const kmPerDegreeLat = 110.574;
    const kmPerDegreeLng = 111.320 * Math.cos(lat * Math.PI / 180);

    // Calcular os limites geográficos para a consulta
    const latMin = lat - raioKm / kmPerDegreeLat;
    const latMax = lat + raioKm / kmPerDegreeLat;
    const lngMin = lng - raioKm / kmPerDegreeLng;
    const lngMax = lng + raioKm / kmPerDegreeLng;

    // Criar um Set para armazenar UIDs únicos
    const usuariosUnicos = new Set();

    // Consulta Firestore com limites
    db.collection("locations")
        .where("location", ">=", new admin.firestore.GeoPoint(latMin, lngMin))
        .where("location", "<=", new admin.firestore.GeoPoint(latMax, lngMax))
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const localLat = data.location.latitude;
                const localLng = data.location.longitude;

                // Calcular a distância do ponto central
                const distancia = haversineDistance(lat, lng, localLat, localLng);

                // Verificar se está dentro do raio de 5 km
                if (distancia <= raioKm) {
                    // Adicionar o UID ao Set de usuários únicos
                    usuariosUnicos.add(data.uid);
                }
            });

            // Converter Set de UIDs únicos para um array
            const usuariosArray = Array.from(usuariosUnicos);

            if (usuariosArray.length > 0) {
                console.log(`Usuários encontrados dentro de 5 km: ${usuariosArray.join(', ')}`);
                // Chamar a função para buscar os pushTokens correspondentes aos UIDs
                buscarPushTokens(usuariosArray);
            } else {
                console.log("Nenhum usuário encontrado dentro de 5 km.");
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar locais:", error);
        });
}

// Função para buscar pushTokens dos UIDs encontrados e agrupar por usuário
function buscarPushTokens(uids) {
    if (uids.length === 0) {
        console.log("Nenhum usuário encontrado.");
        return;
    }

    console.log(`Buscando pushTokens para os UIDs:`, uids);

    // Criar um objeto para agrupar os tokens por UID
    const tokensPorUsuario = {};

    // Criar uma consulta para a coleção pushTokens, filtrando pelos UIDs
    db.collection('pushTokens')
        .where('uid', 'in', uids) // Buscar pushTokens dos UIDs
        .get()
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
                console.log(`Usuário encontrado: ${uid}. Tokens: ${tokens.join(' - ')}`);

                // Filtrar apenas tokens válidos antes de enviar
                const tokensValidos = tokens.filter(token => Expo.isExpoPushToken(token));
                
                if (tokensValidos.length > 0) {
                    // Chamar a função para enviar a notificação
                    enviarNotificacao(tokensValidos, "BORA FALTA NA FACULDADE");
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
function enviarNotificacao(pushTokens, mensagem) {
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
            sound: 'default',
            body: mensagem,
            data: { withSome: 'data' },
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
        if (ticket.status === 'ok') {
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
                    if (status === 'ok') {
                        continue;
                    } else if (status === 'error') {
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

// Usar o geopoint importado do arquivo dados.js
buscarLocaisProximos(geopoint);

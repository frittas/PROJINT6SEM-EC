// Importar o Firebase Admin SDK
const admin = require('firebase-admin');
const geopoint = require('./dados.js');

// Inicializar o Firebase Admin SDK
const serviceAccount = require('C:/Users/Pichau/Desktop/config/rams-bc25c-firebase-adminsdk-4vbvu-aa158e768d.json'); // Substitua pelo caminho para o seu arquivo de chave

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

// Função para buscar locais próximos dentro de 5 km
function buscarLocaisProximos(centroGeoPoint, raioKm = 6000) {
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

    // Variável para contar quantos locais foram encontrados
    let contadorLocais = 0;

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
                const uid = data.location.uid;

                // Calcular a distância do ponto central
                const distancia = haversineDistance(lat, lng, localLat, localLng);
                
                // Verificar se está dentro do raio de 5 km
                if (distancia <= raioKm) {
                    contadorLocais++; // Incrementar o contador se o local estiver dentro do raio
                    console.log(`Local próximo encontrado: ${data.title}, Distância: ${distancia.toFixed(2)} km - ${data.uid}`);
                }
            });

            // Exibir o número de locais encontrados
            console.log(`Total de locais encontrados dentro de ${raioKm} km: ${contadorLocais}`);
        })
        .catch((error) => {
            console.error("Erro ao buscar locais:", error);
        });
}

// Usar o geopoint importado do arquivo dados.js
buscarLocaisProximos(geopoint);

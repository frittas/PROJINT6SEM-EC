// services/locationService.js
const { collection, query, where, getDocs, GeoPoint } = require("firebase/firestore");
const { haversineDistance } = require("./distanceService");
const { buscarPushTokens } = require("./pushTokensService");
const db = require("../firebaseConfig").db; // Importando o db do arquivo de configuração

async function buscarLocaisProximos(lat, lng, radius, title, message) {
  const kmPerDegreeLat = 110.574;
  const kmPerDegreeLng = 111.32 * Math.cos((lat * Math.PI) / 180);

  const latMin = lat - radius / kmPerDegreeLat;
  const latMax = lat + radius / kmPerDegreeLat;
  const lngMin = lng - radius / kmPerDegreeLng;
  const lngMax = lng + radius / kmPerDegreeLng;

  const usuariosUnicos = new Set();

  const q = query(
    collection(db, "locations"),
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

module.exports = {
  buscarLocaisProximos,
};

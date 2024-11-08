// services/locationService.js
const {
  getFirestore,
  collection,
  addDoc,
  GeoPoint,
} = require("firebase/firestore");
const { firebaseApp } = require("../firebaseConfig");

const db = getFirestore(firebaseApp);

class LocationService {
  async addLocation(uid, title, latitude, longitude) {
    if (!uid || !title || !latitude || !longitude) {
      throw new Error("Insira todos os valores!");
    }

    try {
      const userLocationsRef = collection(db, `users/${uid}/locations`);
      const newLocationRef = await addDoc(userLocationsRef, {
        title,
        latitude,
        longitude,
        createdAt: new Date(),
      });

      return { locationId: newLocationRef.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addGeoPoint(uid, title, latitude, longitude) {
    if (!uid || !title || !latitude || !longitude) {
      throw new Error("Insira todos os valores!");
    }

    try {
      const newLocationRef = await addDoc(collection(db, "locations"), {
        uid,
        title,
        location: new GeoPoint(latitude, longitude),
        createdAt: new Date(),
      });

      return { locationId: newLocationRef.id };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new LocationService();

import {
  collection,
  addDoc,
  getDocs,
  GeoPoint,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "./config";
import { LatLng } from "react-native-maps";

const collectionName = "locations";
const getUserLocations = async () => {
  try {
    const q = query(
      collection(db, collectionName),
      where("uid", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
  } catch (e) {
    throw e;
  }
};

const addLocation = async (latlng: LatLng, title: string) => {
  const location = new GeoPoint(latlng.latitude, latlng.longitude);
  const createdAt = new Date();

  try {
    const docRef = await addDoc(collection(db, collectionName), {
      createdAt: createdAt,
      location: location,
      title: title,
      uid: auth.currentUser?.uid,
    });
    return docRef;
  } catch (e) {
    throw e;
  }
};

const addPushToken = async (token: string) => {
  try {
    await addDoc(collection(db, "pushTokens"), {
      uid: auth.currentUser?.uid,
      token: token,
    });
  } catch (e) {
    throw e;
  }
};

const removeLocation = async (documentId: string) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (e) {
    throw e;
  }
};

export { addLocation, getUserLocations, removeLocation, addPushToken };

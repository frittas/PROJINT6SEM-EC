import React, { useEffect, useState, useRef, useContext } from "react";
import { View, Image, TextInput, Text } from "react-native";
import MapView, {
  LatLng,
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import { style } from "./styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import SearchBox from "../searchbox";
import {
  collection,
  addDoc,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { db } from "../../services/config";
import { AuthContextList } from "../../context/authContext_list";

export default function Map() {
  const { selectedLocation, setSelectedLocation } =
    useContext<any>(AuthContextList);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setSelectedLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    mapRef.current?.animateCamera({
      pitch: 70,
      center: selectedLocation!,
    });
    // watchPositionAsync(
    //   {
    //     accuracy: LocationAccuracy.Highest,
    //     timeInterval: 1000,
    //     distanceInterval: 1,
    //   },
    //   (response) => {
    //     mapRef.current?.animateCamera({
    //       pitch: 70,
    //       center: response.coords,
    //     });
    //   }
    // );
  }, []);

  const handlePress = (e: MapPressEvent) => {
    setSelectedLocation(e.nativeEvent.coordinate);
    mapRef.current?.animateCamera({
      pitch: 70,
      center: e.nativeEvent.coordinate,
    });
  };

  return (
    <View style={style.container}>
      {selectedLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          onPress={handlePress}
          ref={mapRef}
          style={style.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            tracksViewChanges={false}
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
          >
            <Image
              source={require("../../assets/Vector.png")}
              style={{ width: 50, height: 65 }}
              resizeMode="stretch"
            />
          </Marker>
        </MapView>
      )}
      <SearchBox></SearchBox>
    </View>
  );
}

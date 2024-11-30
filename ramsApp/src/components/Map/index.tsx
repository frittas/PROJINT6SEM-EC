import React, { useEffect, useRef, useContext } from "react";
import { View } from "react-native";
import MapView, {
  MapPressEvent,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { style } from "./styles";
import SearchBox from "../searchbox";
import { AuthContextList } from "../../context/authContext_list";

export default function Map() {
  const { selectedLocation, setSelectedLocation, onMapPress, setMapRef } =
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
    setMapRef(mapRef);
    requestLocationPermission();
  }, []);

  useEffect(() => {
    console.log("LOCATION CHANGED", selectedLocation);
    mapRef.current?.animateCamera({
      pitch: 70,
      center: selectedLocation as any,
    });
  }, [selectedLocation]);

  return (
    <View style={style.container}>
      {selectedLocation && (
        <MapView
          provider={PROVIDER_GOOGLE}
          onPress={onMapPress}
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
            {/* <Image
              source={require("../../assets/Vector.png")}
              style={{ width: 50, height: 65 }}
              resizeMode="stretch"
            /> */}
          </Marker>
        </MapView>
      )}
      <SearchBox></SearchBox>
    </View>
  );
}

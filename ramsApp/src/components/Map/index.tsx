import React, { useEffect, useState, useRef } from "react";
import { View, Image, TextInput, Text } from "react-native";
import MapView, { LatLng, MapPressEvent, Marker } from "react-native-maps";
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

export default function Map() {
  const [location, setLocation] = useState<LatLng | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation({
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      });
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // useEffect(() => {
  //   watchPositionAsync(
  //     {
  //       accuracy: LocationAccuracy.Highest,
  //       timeInterval: 1000,
  //       distanceInterval: 1,
  //     },
  //     (response) => {
  //       setLocation({
  //         latitude: response.coords.latitude,
  //         longitude: response.coords.longitude,
  //       });
  //       mapRef.current?.animateCamera({
  //         pitch: 70,
  //         center: response.coords,
  //       });
  //     }
  //   );
  // }, []);

  const handlePress = (e: MapPressEvent) => {
    setLocation(e.nativeEvent.coordinate);
    mapRef.current?.animateCamera({
      pitch: 70,
      center: e.nativeEvent.coordinate,
    });
  };

  return (
    <View style={style.container}>
      {location && (
        <MapView
          onPress={handlePress}
          ref={mapRef}
          style={style.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
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

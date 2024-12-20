import React, { createContext, useContext, useRef, useState } from "react";
import {
  Text,
  Dimensions,
  Modal,
  View,
  StyleSheet,
  ScrollView,
  Animated,
  Alert,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { CustomInput } from "../components/AnimatedInputField";
import Button from "../components/Button";
import { themes } from "../global/themes";
import MapView, { LatLng, MapPressEvent } from "react-native-maps";
import { addLocation, getUserLocations } from "../services/dbService";
import { auth } from "../services/config";
import { signOut } from "../services/authService";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { LoadingContext } from "./loaderContext";

export const AuthContextList: any = createContext({});

export const AuthProviderList = (props: any): any => {
  const modalizeNewLocationRef = useRef<Modalize>(null);
  const modalizeLogout = useRef<Modalize>(null);
  const modalizeList = useRef<Modalize>(null);
  const { loading, setLoading } = useContext<any>(LoadingContext);

  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(null);
  const [newLocationName, setnewLocationName] = useState("");
  const [mapRef, setMapRef] = useState<React.RefObject<MapView> | null>(null);

  const [locationList, setLocationList] = useState([]);
  const [pushTokenString, setPushTokenString] = useState([]);

  const navigation = useNavigation<NavigationProp<any>>();

  const onMapPress = (e: any) => {    
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const onOpenNewLocation = () => {
    setnewLocationName("");
    modalizeNewLocationRef.current?.open();
  };

  const onCloseNewLocation = async () => {
    console.log(selectedLocation);
    try {
      setLoading(true);
      await addLocation(selectedLocation as any, newLocationName);
      modalizeNewLocationRef.current?.close();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onOpenLogout = () => {
    modalizeLogout.current?.open();
  };

  const onCloseLogout = async () => {
    try {
      setLoading(true);
      await signOut();
    } finally {
      setLoading(false);
    }
    navigation.navigate("Login");
  };

  const onOpenList = async () => {
    modalizeList.current?.open();
    try {
      setLoading(true);
      const snapshot = await getUserLocations();
      let locations: any = [];
      snapshot.forEach((doc) => {
        locations.push({ ...doc.data(), id: doc.id });
      });
      setLocationList(locations);
    } finally {
      setLoading(false);
    }
  };

  const onCloseList = async () => {};

  const onClickListItem = async (location: any) => {
    setSelectedLocation(location.location);
  };

  const modalAdd = () => {
    return (
      <View style={style.container}>
        <View style={style.main}>
          <Text style={style.mainText}>Novo Local</Text>
          <CustomInput
            icon="home"
            placeholder="Nome do local"
            value={newLocationName}
            onChangeText={setnewLocationName}
          ></CustomInput>
        </View>
        <View style={style.bottom}>
          <Button title="Salvar" onPress={onCloseNewLocation}></Button>
        </View>
      </View>
    );
  };

  const modalLogout = () => {
    return (
      <View style={style.containerLogout}>
        <View style={style.main}>
          <Text style={style.mainText}>{auth.currentUser?.displayName}</Text>
          <Text style={style.mainText}>{auth.currentUser?.email}</Text>
        </View>
        <View style={style.bottom}>
          <Button title="Logout" onPress={onCloseLogout}></Button>
        </View>
      </View>
    );
  };

  const modalList = () => {
    return (
      <View style={style.containerList}>
        <Text style={style.mainTextList}>Meus Locais</Text>
        <ScrollView>
          {locationList.map((location: any, index) => {
            return (
              // <TouchableOpacity key={index} style={style.listItem}>
              //   <Text>{location.title}</Text>
              //   <FontAwesome size={20} name="close"></FontAwesome>
              // </TouchableOpacity>
              <Swipeable key={index} renderRightActions={renderRightActions}>
                <TouchableOpacity
                  style={style.row}
                  onPress={() => {
                    onClickListItem(location);
                  }}
                >
                  <Text style={style.rowText}>{location.title}</Text>
                  <FontAwesome
                    style={style.iconLeft}
                    name="chevron-right"
                    size={20}
                  ></FontAwesome>
                </TouchableOpacity>
              </Swipeable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderRightActions = (progress: any, dragAnimatedValue: any) => {
    const opacity = dragAnimatedValue.interpolate({
      inputRange: [-150, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={style.swipedRow}>
        <View style={style.swipedConfirmationContainer}>
          {/* <Text style={style.deleteConfirmationText}>Are you sure?</Text> */}
        </View>
        <Animated.View style={[style.deleteButton, { opacity }]}>
          <TouchableOpacity>
            <FontAwesome
              name="trash"
              style={style.deleteButtonText}
              size={20}
            ></FontAwesome>
            {/* <Text style={style.deleteButtonText}>Delete</Text> */}
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <AuthContextList.Provider
      value={{
        onOpenNewLocation,
        onCloseNewLocation,
        onOpenLogout,
        onCloseLogout,
        onOpenList,
        onCloseList,
        selectedLocation,
        setSelectedLocation,
        onMapPress,
        setMapRef,
        pushTokenString,
      }}
    >
      {props.children}
      <Modalize
        ref={modalizeNewLocationRef}
        childrenStyle={{ height: Dimensions.get("window").height / 2 }}
        adjustToContentHeight={true}
      >
        {modalAdd()}
      </Modalize>
      <Modalize
        ref={modalizeLogout}
        childrenStyle={{ height: Dimensions.get("window").height / 4 }}
        adjustToContentHeight={true}
      >
        {modalLogout()}
      </Modalize>
      <Modalize
        ref={modalizeList}
        childrenStyle={{ height: Dimensions.get("window").height / 2 }}
        adjustToContentHeight={true}
        onClosed={onCloseList}
      >
        {modalList()}
      </Modalize>
    </AuthContextList.Provider>
  );
};

export const useAuth = () => useContext(AuthContextList);

export const style = StyleSheet.create({
  container: {
    padding: 30,
    height: Dimensions.get("window").height / 2,
  },
  containerList: {
    height: Dimensions.get("window").height / 2,
  },
  containerLogout: {
    padding: 30,
    height: Dimensions.get("window").height / 4,
  },
  main: {
    flex: 1,
    height: "100%",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
  mainText: {
    color: themes.colors.text,
    fontSize: 24,
    textAlign: "center",
  },
  mainTextList: {
    color: themes.colors.text,
    fontSize: 24,
    textAlign: "center",
    marginVertical: 30,
  },
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 5,
    backgroundColor: "#fff",
    borderColor: themes.colors.gray,
    minHeight: 60,
  },
  swipedRow: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    paddingLeft: 5,
    backgroundColor: "#b60000",
    minHeight: 60,
    paddingEnd: 40,
  },
  swipedConfirmationContainer: {
    flex: 1,
  },

  rowText: {
    color: themes.colors.text,
    fontSize: 20,
    paddingLeft: 30,
  },
  deleteButton: {
    backgroundColor: "#b60000",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  deleteButtonText: {
    color: "#fcfcfc",
    fontWeight: "bold",
    padding: 3,
  },
  iconLeft: {
    paddingRight: 20,
  },
});

import { faCheck, faClose, faHome } from "@fortawesome/free-solid-svg-icons";
import React, { createContext, useContext, useRef } from "react";
import { Text, Dimensions, Modal, View, StyleSheet } from "react-native";
import { Modalize } from "react-native-modalize";
import { CustomInput } from "../components/AnimatedInputField";
import Button from "../components/Button";
import { themes } from "../global/themes";
import { FontAwesome } from "@expo/vector-icons";

export const AuthContextList: any = createContext({});

export const AuthProviderList = (props: any): any => {
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  const modalAdd = () => {
    return (
      <View style={style.container}>
        <View style={style.main}>
          <Text style={style.mainText}>Novo Local</Text>
          <CustomInput icon="home" placeholder="Nome do local"></CustomInput>
        </View>
        <View style={style.bottom}>
          <Button title="Salvar" onPress={onClose}></Button>
        </View>
      </View>
    );
  };

  return (
    <AuthContextList.Provider value={{ onOpen, onClose }}>
      {props.children}
      <Modalize
        ref={modalizeRef}
        childrenStyle={{ height: Dimensions.get("window").height / 2 }}
        adjustToContentHeight={true}
      >
        {modalAdd()}
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
});

import React from "react";
import { Text, View, Image, Alert } from "react-native";

import { style } from "./styles";
import logo from "../../assets/LogoRams.png";
import { AnimatedInputField } from "../../components/animatedInputField";
import Button from "../../components/button";
export default function Login() {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image source={logo} style={style.logo} resizeMode="contain" />
        <Text style={style.text}>RAMS</Text>
        <Text>Risk Area Monitoring System</Text>
      </View>

      <View style={style.main}>
        <AnimatedInputField title="Usuário"></AnimatedInputField>
        <AnimatedInputField title="Senha" secure={true}></AnimatedInputField>
      </View>
      <View style={style.footer}>
        <Button
          title="Login"
          onPress={() => Alert.alert("Simple Button pressed")}
        ></Button>
        <View>
          <Text>Não tem uma conta?</Text>
          <Text>Clique aqui!</Text>
        </View>
      </View>
    </View>
  );
}

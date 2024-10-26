import React from "react";
import { Text, View, Image, Alert, Pressable } from "react-native";

import { style } from "./styles";
import logo from "../../assets/LogoRams.png";
import { AnimatedInputField } from "../../components/AnimatedInputField";
import Button from "../../components/Button";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  async function getLogin() {
    navigation.navigate("BottomRoutes");
  }

  async function getSignup() {
    navigation.navigate("Signup");
  }

  return (
    <View style={style.container}>
      <View style={style.header}></View>

      <View style={style.main}>
        <View style={style.logoContainer}>
          <Image source={logo} style={style.logo} resizeMode="contain" />
          <View>
            <Text style={style.textLogoBig}>RAMS</Text>
            <Text style={style.textLogoSmall}>Risk Area Monitoring System</Text>
          </View>
        </View>
        <AnimatedInputField icon={faUser} title="Usuário"></AnimatedInputField>
        <AnimatedInputField
          icon={faLock}
          title="Senha"
          secure={true}
        ></AnimatedInputField>
        <View style={style.button}>
          <Button title="Login" onPress={getLogin}></Button>
        </View>
      </View>
      <View style={style.footer}>
        <Pressable onPress={() => Alert.alert("Esqueci senha")}>
          <Text style={style.infoTextLink}> Esqueceu a senha?</Text>
        </Pressable>
        <View style={style.infoContainer}>
          <Text style={style.infoText}>Não tem uma conta?</Text>
          <Pressable onPress={getSignup}>
            <Text style={style.infoTextLink}> Clique aqui!</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

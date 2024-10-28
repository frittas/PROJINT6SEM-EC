import React, { useState } from "react";
import { Text, View, Image, Alert, Pressable } from "react-native";

import { style } from "./styles";
import logo from "../../assets/LogoRams.png";
import { CustomInput } from "../../components/AnimatedInputField";
import Button from "../../components/Button";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  async function getLogin() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigation.navigate("BottomRoutes");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
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
        <CustomInput
          icon="envelope"
          placeholder="Usuário"
          value={email}
          onChangeText={setEmail}
        ></CustomInput>
        <CustomInput
          icon="lock"
          placeholder="Senha"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        ></CustomInput>
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

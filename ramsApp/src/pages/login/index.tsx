import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  Alert,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { style } from "./styles";
import logo from "../../assets/LogoRams.png";
import { CustomInput } from "../../components/AnimatedInputField";
import Button from "../../components/Button";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signIn } from "../../services/authService";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function getLogin() {
    try {
      const user = await signIn(email, password);
      navigation.navigate("BottomRoutes");
    } catch (error: any) {
      if (
        error.code == "auth/user-not-found" ||
        error.code == "auth/wrong-password" ||
        error.code == "auth/invalid-credential"
      ) {
        Alert.alert("Usuário Inválido");
      } else if (error.code == "auth/too-many-requests") {
        Alert.alert(
          "Muitas tentativas inválidas, tente de novo em alguns instantes"
        );
      } else {
        Alert.alert("Erro no Login " + error.message);
      }
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
        <KeyboardAvoidingView behavior="padding">
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
        </KeyboardAvoidingView>
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

import React, { useState } from "react";
import logo from "../../assets/LogoRams.png";
import { Pressable, Text, View, Image, Alert } from "react-native";
import { CustomInput } from "../../components/AnimatedInputField";
import { style } from "./styles";
import Button from "../../components/Button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { signUp } from "../../services/authService";

export default function Signup() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [name, setName] = useState("");

  async function navigateToLogin() {
    navigation.navigate("Login");
  }

  async function handleSignUp() {
    try {
      if (email && name && password == passwordConfirmation) {
        await signUp(email, password, name);
        navigation.navigate("Login");
      } else if (password !== passwordConfirmation) {
        Alert.alert("As duas senhas devem ser iguais");
      }
    } catch (error: any) {
      if (error.code == "auth/email-already-exists") {
        Alert.alert("O Email utilizado já existe, tente outro");
      } else {
        Alert.alert("Erro no cadastro " + error.message);
      }
    }
  }

  return (
    <View style={style.container}>
      <View style={style.header}></View>
      <View style={style.main}>
        <View style={style.logoContainer}>
          <Image source={logo} style={style.logo} resizeMode="contain" />
          <View>
            <Text style={style.textLogoBig}>RAMS</Text>
          </View>
        </View>
        <Text style={style.createAccountText}>Crie sua conta!</Text>
        <CustomInput
          icon="user"
          value={name}
          onChangeText={setName}
          placeholder="Usuário"
        ></CustomInput>
        <CustomInput
          icon="envelope"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          inputMode="email"
        ></CustomInput>
        <CustomInput
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry={true}
        ></CustomInput>
        <CustomInput
          icon="lock"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          placeholder="Confirmar Senha"
          secureTextEntry={true}
        ></CustomInput>
        <View style={style.button}>
          <Button title="Cadastre-se" onPress={handleSignUp}></Button>
        </View>
      </View>
      <View style={style.footer}>
        <View style={style.infoContainer}>
          <Text style={style.infoText}>Já tem uma conta?</Text>
          <Pressable onPress={navigateToLogin}>
            <Text style={style.infoTextLink}> Entre agora!</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

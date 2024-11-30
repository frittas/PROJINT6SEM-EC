import React, { useContext, useState } from "react";
import logo from "../../assets/LogoRams.png";
import { Pressable, Text, View, Image, Alert } from "react-native";
import { CustomInput } from "../../components/AnimatedInputField";
import { style } from "./styles";
import Button from "../../components/Button";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { lostPass } from "../../services/authService";
import { LoadingContext } from "../../context/loaderContext";

export default function LostPassword() {
  const navigation = useNavigation<NavigationProp<any>>();
  const { loading, setLoading } = useContext<any>(LoadingContext);

  const [email, setEmail] = useState("");

  async function navigateToLogin() {
    navigation.navigate("Login");
  }

  async function handleLostPass() {
    try {
      setLoading(true);
      if (email) {
        await lostPass(email);
        navigation.navigate("Login");
      } else {
        Alert.alert("Digite um email válido");
      }
    } catch (error: any) {
      if (error.code == "auth/invalid-email") {
        Alert.alert("O Email utilizado é inválido, tente outro");
      } else {
        Alert.alert("Erro ao solicitar nova senha " + error.message);
      }
    } finally {
      setLoading(false);
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
        <Text style={style.createAccountText}>Digite o email cadastrado</Text>

        <CustomInput
          icon="envelope"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          inputMode="email"
        ></CustomInput>
        <View style={style.button}>
          <Button title="Enviar email" onPress={handleLostPass}></Button>
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

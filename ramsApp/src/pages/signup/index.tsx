import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import logo from "../../assets/LogoRams.png";
import { Pressable, Text, View, Image } from "react-native";
import { CustomInput } from "../../components/AnimatedInputField";
import { style } from "./styles";
import Button from "../../components/Button";

export default function Signup() {
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
        {/* <CustomInput icon="user" placeholder="Usuário"></CustomInput> */}
        <CustomInput icon="envelope" placeholder="Email"></CustomInput>
        <CustomInput
          icon="lock"
          placeholder="Senha"
          secureTextEntry={true}
        ></CustomInput>
        <CustomInput
          icon="lock"
          placeholder="Confirmar Senha"
          secureTextEntry={true}
        ></CustomInput>
        <View style={style.button}>
          <Button title="Cadastre-se"></Button>
        </View>
      </View>
      <View style={style.footer}>
        <View style={style.infoContainer}>
          <Text style={style.infoText}>Já tem uma conta?</Text>
          <Pressable>
            <Text style={style.infoTextLink}> Entre agora!</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

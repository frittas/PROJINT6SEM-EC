import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { themes } from "../../global/themes";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Button(props: any) {
  const { onPress, title = "Save" } = props;
  return (
    <TouchableOpacity style={style.button} onPress={onPress}>
      <Text style={style.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: themes.colors.secondary,
    height: 55,
    elevation: 2
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: themes.colors.text,
  },
});

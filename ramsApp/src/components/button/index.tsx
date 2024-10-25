import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { themes } from "../../global/themes";

export default function Button(props: any) {
  const { onPress, title = "Save" } = props;
  return (
    <Pressable style={style.button} onPress={onPress}>
      <Text style={style.text}>{title}</Text>
    </Pressable>
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
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: themes.colors.text,
  },
});

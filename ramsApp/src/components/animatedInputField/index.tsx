import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Animated } from "react-native";
import { style } from "./styles";

export const AnimatedInputField = (props: {
  title: string;
  text?: string;
  secure?: boolean;
}) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [secure, setSecure] = useState(false);

  const floatingLabelAnimation = useRef(
    new Animated.Value(text ? 1 : 0)
  ).current;

  useEffect(() => {
    setTitle(props.title);
    setSecure(props.secure ? true : false);
  }, [props.title]);

  const handleFocus = () => {
    Animated.timing(floatingLabelAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = () => {
    if (!text) {
      Animated.timing(floatingLabelAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const floatingLabelStyle = {
    top: floatingLabelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -20],
    }),
    left: floatingLabelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -20],
    }),
    fontSize: floatingLabelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 16],
    }),
  };

  return (
    <View style={style.container}>
      <Animated.Text style={[style.label, floatingLabelStyle]}>
        {title}
      </Animated.Text>
      <TextInput
        style={style.input}
        value={text}
        secureTextEntry={secure}
        onChangeText={(val) => setText(val)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      ></TextInput>
    </View>
  );
};

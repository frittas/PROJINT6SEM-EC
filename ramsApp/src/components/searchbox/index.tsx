import React, { useRef, useState } from "react";

import { Text, StyleSheet, TextInput, View, Animated } from "react-native";
import { themes } from "../../global/themes";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SearchBox(props: any) {
  const { onPress } = props;
  const [searchText, setSearchText] = useState("");

  const expandAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(expandAnimation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = () => {
    if (!searchText) {
      Animated.timing(expandAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const floatingLabelStyle = {
    top: expandAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -20],
    }),
    left: expandAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, -20],
    }),
    fontSize: expandAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [12, 16],
    }),
  };

  return (
    <View style={style.searchBox}>
      <Animated.Text style={[style.searchBoxField, floatingLabelStyle]}>
        Procurar lugares
      </Animated.Text>
      {/* <Text style={style.searchBoxField}>Procurar lugares</Text> */}
      <TextInput onFocus={handleFocus} onBlur={handleBlur} />
      <TouchableOpacity style={style.buttonContainer}>
        <Text style={style.buttonLabel}>Procurar</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  searchBox: {
    position: "absolute",
    width: "90%",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: themes.colors.bgScreen,
    padding: 8,
    alignSelf: "center",
    top: 60,
  },
  searchBoxField: {
    borderColor: "#777",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 18,
    marginBottom: 8,
  },
  buttonContainer: {},
  buttonLabel: {},
});

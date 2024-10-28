import React, { useRef, useState } from "react";

import {
  Text,
  StyleSheet,
  TextInput,
  View,
  Animated,
  Dimensions,
} from "react-native";
import { themes } from "../../global/themes";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";

import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";

export default function SearchBox(props: any) {
  const { onPress } = props;
  const [searchText, setSearchText] = useState("");

  const inputRef = useRef<TextInput>(null);

  const expandAnimation = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    Animated.timing(expandAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    // inputRef.current?.blur();
    if (!searchText) {
      Animated.timing(expandAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const focus = () => {
    inputRef.current?.focus();
  };

  const blur = () => {
    inputRef.current?.blur();
  };

  const expandableSearchStyle = {
    width: expandAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [40, Dimensions.get("screen").width - 40],
    }),
  };

  return (
    <Animated.View style={[style.searchBox, expandableSearchStyle]}>
      <TouchableOpacity style={style.iconContainer} onPress={focus}>
        <FontAwesome name="search" color={themes.colors.gray} size={20}></FontAwesome>
      </TouchableOpacity>
      <TextInput ref={inputRef} onBlur={handleBlur} onFocus={handleFocus} />
      {/* <TouchableOpacity style={style.iconContainer} onPress={blur}>
        <FontAwesome
          icon={faClose}
          color={themes.colors.gray}
        ></FontAwesome>
      </TouchableOpacity> */}
    </Animated.View>
  );
}

const style = StyleSheet.create({
  searchBox: {
    flex: 1,
    position: "absolute",
    borderRadius: 100,
    backgroundColor: themes.colors.white,
    top: 60,
    left: 20,
    flexDirection: "row",
    elevation: 10,
    paddingVertical: 0,
    paddingHorizontal: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  iconContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
});

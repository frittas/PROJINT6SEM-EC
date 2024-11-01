import React, { useContext } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { themes } from "../../global/themes";
import { TouchableHighlight } from "react-native-gesture-handler";
import { AuthContextList } from "../../context/authContext_list";
import { FontAwesome } from "@expo/vector-icons";

export default ({ state, navigation }: any) => {
  const { onOpenNewLocation, onOpenLogout, onOpenList } =
    useContext<any>(AuthContextList);
  return (
    <View style={style.tabArea}>
      <TouchableOpacity style={style.tabItem} onPress={onOpenLogout}>
        <FontAwesome style={style.icon} name="bars" size={30} />
      </TouchableOpacity>
      <TouchableHighlight
        underlayColor="#F2DC6D"
        onPress={onOpenNewLocation}
        style={style.tabItemRound}
      >
        <FontAwesome style={style.iconPlus} name="plus" size={40} />
      </TouchableHighlight>
      <TouchableOpacity style={style.tabItem} onPress={onOpenList}>
        <FontAwesome style={style.icon} name="location-arrow" size={35} />
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  tabArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 60,
    backgroundColor: themes.colors.primary,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: themes.colors.bgScreen,
  },
  iconPlus: {
    color: themes.colors.text,
  },
  tabItemRound: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: themes.colors.secondary,
    borderRadius: 100,
    width: 65,
    height: 65,
    top: -30,
    elevation: 3,
  },
});

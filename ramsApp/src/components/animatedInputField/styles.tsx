import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  label: {
    paddingLeft: 35,
    position: "absolute",
    zIndex: 1,
    color: themes.colors.bgScreen,
  },
  input: {
    padding: 10,
    backgroundColor: themes.colors.heather,
    borderRadius: 10,
    height: 60,
    fontSize: 20,
    paddingHorizontal: 20,
  },
  icon: {
    color: themes.colors.bgScreen,
    position: 'absolute',
    right: 20,
    top: 20
  },
});

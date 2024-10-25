import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    marginTop: 25,
  },
  label: {
    paddingLeft: 35,
    position: 'absolute',
    zIndex: 1,
    color: themes.colors.gray
  },
  input: {
    padding: 10,
    backgroundColor: themes.colors.heather,
    borderRadius: 10,
  },
});

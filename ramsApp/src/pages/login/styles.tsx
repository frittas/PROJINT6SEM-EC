import { Dimensions, StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: Dimensions.get("window").height / 3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    height: Dimensions.get("window").height / 4,
    width: "100%",
    paddingHorizontal: 35,
  },
  footer: {
    height: Dimensions.get("window").height / 3,
    width: "100%",
    paddingHorizontal: 35,

  },
  logo: {
    width: 80,
    height: 80,
  },
  text: {
    fontWeight: "bold",
  },
  button: {
    
  },
});

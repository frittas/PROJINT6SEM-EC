import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: Dimensions.get("window").height / 5,

    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    height: Dimensions.get("window").height / 2,
    width: "100%",
    paddingHorizontal: 35,
  },
  footer: {
    height: Dimensions.get("window").height / 6,
    width: "100%",
    paddingHorizontal: 35,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 55,
  },
  logo: {
    width: 95,
    height: 95,
  },
  textLogoBig: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 78,
    color: themes.colors.text,
  },
  textLogoSmall: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 16,
    color: themes.colors.text,
    position: "absolute",
    bottom: 0,
    left: 5,
  },
  button: {
    paddingTop: 40,
  },
  infoText: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "medium",
    color: themes.colors.text,
  },
  infoTextLink: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: "bold",
    color: themes.colors.primary,
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});

import { Dimensions, StyleSheet } from "react-native";
import { themes } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: Dimensions.get("window").height / 10,

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
    height: Dimensions.get("window").height / 3.5,
    width: "100%",
    paddingHorizontal: 35,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 55,
  },
  logo: {
    width: 65,
    height: 65,
  },
  textLogoBig: {
    fontWeight: "bold",
    fontFamily: "Roboto",
    fontSize: 64,
    color: themes.colors.text,
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
    alignItems: "flex-end",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  createAccountText: {
    fontSize: 20,
    // fontWeight: "bold",
    textAlign: "center",
    color: themes.colors.gray,
    fontFamily: 'Roboto'
  }
});

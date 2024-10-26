import "./gesture-handler";
import { StyleSheet, Text, View } from "react-native";

import Routes from "./src/routes/index.routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <NavigationContainer>
      {/* <View style={styles.container}>
        <Login />
        <StatusBar style="auto" />
      </View> */}
      <Routes />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

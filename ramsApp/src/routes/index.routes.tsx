import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login";
import { themes } from "../global/themes";
import BottomRoutes from "./bottom.routes";
import Signup from "../pages/signup";
import { LoadingContext, LoadingProvider } from "../context/loaderContext";
export default function Routes() {
  const Stack = createStackNavigator();
  return (
    <LoadingProvider>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          cardStyle: {
            backgroundColor: themes.colors.bgScreen,
          },
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="BottomRoutes" component={BottomRoutes} />
      </Stack.Navigator>
    </LoadingProvider>
  );
}

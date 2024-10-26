import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../pages/home";
import User from "../pages/user";
import { themes } from "../global/themes";
import CustomTabBar from "../components/CustomTabBar";
import { AuthProviderList } from "../context/authContext_list";
export default function BottomRoutes() {
  const Tab = createBottomTabNavigator();
  return (
    <AuthProviderList>
      <Tab.Navigator
        initialRouteName="Login"
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: themes.colors.primary,
          },
        }}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="User" component={User} />
      </Tab.Navigator>
    </AuthProviderList>
  );
}

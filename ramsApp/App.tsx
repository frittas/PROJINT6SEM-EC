import "./gesture-handler";
import Routes from "./src/routes/index.routes";
import { NavigationContainer } from "@react-navigation/native";
import { Fragment } from "react";

export default function App() {
  return (
    <Fragment>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </Fragment>
  );
}

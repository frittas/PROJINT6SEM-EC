import "./gesture-handler";
import { LoadingProvider } from "./src/context/loaderContext";
import Routes from "./src/routes/index.routes";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <LoadingProvider>
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </LoadingProvider>
  );
}

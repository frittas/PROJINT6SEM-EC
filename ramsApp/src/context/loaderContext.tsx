import { ActivityIndicator, View, StyleSheet } from "react-native";
import { themes } from "../global/themes";
import { createContext, useContext, useState } from "react";

export const LoadingContext: any = createContext({});

export const LoadingProvider = (props: any): any => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {loading && (
        <ActivityIndicator
          style={style.loader}
          size={50}
          color={themes.colors.text}
        />
      )}
      {props.children}
    </LoadingContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};

export const style = StyleSheet.create({
  loader: {
    flex: 1,
  },
});

// export const style = StyleSheet.create({
// loader: {
//     position: absolute;
//     z-index: 99999;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     width: 100vw;
//     height: 100vh;
//     background-color: white;
//     opacity: 0.9;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//   }
//   });

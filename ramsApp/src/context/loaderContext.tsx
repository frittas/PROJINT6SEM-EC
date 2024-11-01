import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
} from "react-native";
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
      <Modal transparent visible={loading}>
        <View style={style.centeredView}>
          <ActivityIndicator
            // style={style.loading}
            size={50}
            color={themes.colors.white}
          />
          {/* <View style={style.modalView}>
           
          </View> */}
        </View>
      </Modal>

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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    opacity: 0.7,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: "center",
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

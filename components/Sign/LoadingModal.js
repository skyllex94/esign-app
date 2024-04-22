import { View, Modal, StyleSheet } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";

export default function LoadingModal({ showModal, setShowModal }) {
  console.log("showModal:", showModal);
  const animation = useRef();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal((curr) => !curr)}
    >
      <View className="flex-1 justify-center items-center">
        <View
          className="m-8 bg-white rounded-lg p-5 shadow"
          style={styles.modalView}
        >
          <View className="flex-row items-center justify-between mb-3 w-full"></View>

          <LottieView
            autoPlay
            ref={animation}
            style={{ width: 100, height: 100 }}
            source={require("../../assets/lottie/progress.json")}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
});

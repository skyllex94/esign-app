import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import DrawingCanvas from "./DrawingCanvas";

export default function AddSignatureModal({
  navigation,
  showSignatureModal,
  setShowSignatureModal,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSignatureModal}
      onBackdropPress={() => setShowSignatureModal(false)}
      onRequestClose={() => setShowSignatureModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setShowSignatureModal(false);
        }}
      />

      <View className="justify-center items-center">
        <View className=" bg-white rounded-lg p-3 shadow w-[95%]">
          <View className="flex-row items-center justify-between"></View>
          <DrawingCanvas
            navigation={navigation}
            isModal={true}
            setShowSignatureModal={setShowSignatureModal}
          />
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setShowSignatureModal(false);
        }}
      />
    </Modal>
  );
}

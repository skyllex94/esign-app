import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";

import DrawingCanvas from "../DrawingCanvas";

export default function AddInitialsModal({
  navigation,
  showInitialsModal,
  setShowInitialsModal,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showInitialsModal}
      onBackdropPress={() => setShowInitialsModal(false)}
      onRequestClose={() => setShowInitialsModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setShowInitialsModal(false);
        }}
      />

      <View className="justify-center items-center">
        <View className=" bg-white rounded-lg p-3 shadow w-[95%]">
          <View className="flex-row items-center justify-between"></View>
          <DrawingCanvas
            navigation={navigation}
            isModal={true}
            setShowSignatureModal={setShowInitialsModal}
            type={"initials"}
          />
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setShowInitialsModal(false);
        }}
      />
    </Modal>
  );
}

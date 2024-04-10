import React, { useRef } from "react";
import { View, Modal } from "react-native";

import SignatureCanvas from "./SignatureCanvas";

export default function AddSignatureModal({
  navigation,
  showSignatureModal,
  setShowSignatureModal,
}) {
  const showSignatureModalRef = useRef();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showSignatureModal}
      onRequestClose={() => setShowSignatureModal((curr) => !curr)}
    >
      <View className="flex-1 justify-center items-center">
        <View className=" bg-white rounded-lg p-3 shadow w-[95%]">
          <View className="flex-row items-center justify-between"></View>
          <SignatureCanvas
            navigation={navigation}
            isModal={true}
            setShowSignatureModal={setShowSignatureModal}
          />
        </View>
      </View>
    </Modal>
  );
}

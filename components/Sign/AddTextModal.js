import { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { actionButton } from "../../constants/UI";

export default function AddTextModal({
  showTextModal,
  setShowTextModal,
  setText,
  setShowText,
}) {
  const textRef = useRef();

  function loadTextPanResponder() {
    setShowText(true);
    setShowTextModal(false);
  }

  useEffect(() => {
    textRef.current.focus();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showTextModal}
      onRequestClose={() => setShowTextModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowTextModal(false)}
      />

      <View className="flex-1 justify-center items-center">
        <View className="m-8 bg-white rounded-lg p-5 shadow">
          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              ref={textRef}
              placeholder="Text to be added..."
              onChangeText={(text) => setText(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row items-center justify-between my-3 w-full">
            <TouchableOpacity
              onPress={loadTextPanResponder}
              className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
            >
              <Text className="text-[16px] text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowTextModal(false)}
              className={`rounded-lg bg-slate-200 py-3 px-6`}
            >
              <Text className="text-[16px]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowTextModal(false)}
      />
    </Modal>
  );
}

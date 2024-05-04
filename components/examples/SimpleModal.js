import { View, Text, Modal, TouchableOpacity } from "react-native";

export default function NameScanModal({ showModal, setShowModal }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowModal(false)}
      />

      <View className="flex-1 justify-center items-center">
        <View className="m-8 bg-white rounded-lg p-5 shadow">
          <Text>Simple Modal</Text>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowModal(false)}
      />
    </Modal>
  );
}

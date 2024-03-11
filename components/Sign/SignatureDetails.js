import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const SignatureDetails = ({
  detailsInfo,
  signatureDetailsModal,
  setSignatureDetailsModal,
}) => {
  const dateCreated = new Date(Math.round(detailsInfo.modificationTime) * 1000);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={signatureDetailsModal}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setSignatureDetailsModal(!signatureDetailsModal);
      }}
    >
      <View className="flex-1 justify-center items-center">
        <View
          className="items-center m-8 bg-white rounded-lg p-5 shadow"
          style={styles.modalView}
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="mr-6">Signature Information</Text>
            <TouchableOpacity
              className="p-2 rounded-lg bg-red-500"
              style={[styles.button, styles.buttonClose]}
              onPress={() => setSignatureDetailsModal(!signatureDetailsModal)}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="gap-1">
            <View className="flex-row justify-between">
              <Text className="mr-3">File Name: </Text>
              <Text>{(path = detailsInfo.uri.split("Signatures/")[1])}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Directory: </Text>
              <Text>(Protected)</Text>
            </View>

            <View className="flex-row justify-between">
              <Text>Size: </Text>
              <Text>{(detailsInfo.size / 1024).toFixed(2)} kB</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="mr-3">Time Created: </Text>
              <Text>{dateCreated.toDateString()}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

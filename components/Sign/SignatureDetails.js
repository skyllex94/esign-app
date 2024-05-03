import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";

export const SignatureDetails = ({
  detailsInfo,
  signatureDetailsModal,
  setSignatureDetailsModal,
  type,
}) => {
  const dateCreated = new Date(Math.round(detailsInfo.modificationTime) * 1000);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={signatureDetailsModal}
      onRequestClose={() => {
        setSignatureDetailsModal(!signatureDetailsModal);
      }}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setSignatureDetailsModal(false);
        }}
      />

      <View className="flex-1 justify-center items-center">
        <View
          className="items-center m-8 bg-white rounded-lg p-5 shadow"
          style={styles.modalView}
        >
          <View className="flex-row items-center justify-between mb-3 w-full">
            {type && type === "initials" ? (
              <Text className="text-[15px] mr-6">Initials Details</Text>
            ) : (
              <Text className="text-[15px] mr-6">Signature Details</Text>
            )}

            <TouchableOpacity
              className={`bg-[#e6867a] rounded-full p-2`}
              onPress={() => setSignatureDetailsModal((curr) => !curr)}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="gap-2 mt-1">
            <View className="flex-row items-center justify-between w-full">
              <Text className="mr-3">File Name: </Text>
              <Text>{(path = detailsInfo.uri.split("Signatures/")[1])}</Text>
            </View>

            <View className="flex-row items-center justify-between w-full">
              <Text>Directory: </Text>
              <Text>(Protected)</Text>
            </View>

            <View className="flex-row items-center justify-between w-full">
              <Text>Size: </Text>
              <Text>{(detailsInfo.size / 1024).toFixed(2)} kB</Text>
            </View>

            <View className="flex-row items-center justify-between w-full">
              <Text className="mr-3">Time Created: </Text>
              <Text>{dateCreated.toDateString()}</Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setSignatureDetailsModal(false);
        }}
      />
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

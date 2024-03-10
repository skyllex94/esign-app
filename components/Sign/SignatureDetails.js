import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const SignatureDetails = ({
  detailsInfo,
  signatureDetailsModal,
  setSignatureDetailsModal,
}) => {
  console.log("detailsInfo", detailsInfo);

  const date = new Date(Math.round(detailsInfo.modificationTime));
  console.log(typeof date);
  console.log("date:", date);
  const realDate = new Date(1394104654000);
  console.log(typeof realDate);
  console.log("realDate:", realDate);

  return (
    <View className="flex-1 justify-center items-center">
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
                className="p-2 rounded-full bg-red-500"
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
                <Text>Time Created: </Text>
                <Text>{}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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

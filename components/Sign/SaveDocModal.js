import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
// UI
import { TextInput } from "react-native";
import { Context } from "../contexts/Global";
import { updateDocuments } from "../functions/Global";
import { actionButton } from "../../constants/UI";

export const SaveDocModal = ({
  //   docName,
  //   setDocName,
  //   docPath,
  //   setDocPath,
  isNamingModal,
  setIsNamingModal,
}) => {
  const renameRef = useRef();
  const [newName, setNewName] = useState(null);
  const { setDocList } = useContext(Context);

  useEffect(() => {
    // Auto focus on the rename field
    renameRef.current.focus();
  }, []);

  //   async function renameDocument() {
  //     if (newName === null) return;

  //     // Split path and file name
  //     const onlyPath = docPath.split(docName)[0];
  //     const newPath = onlyPath + newName + ".pdf";

  //     try {
  //       await FileSystem.moveAsync({
  //         from: docPath,
  //         to: newPath,
  //       });
  //     } catch (err) {
  //       console.log("Error while renaming file: ", err);
  //     }
  //     setDocName(newName);
  //     setDocPath(newPath);
  //     updateDocuments(setDocList);
  //     setIsNamingModal((curr) => !curr);
  //   }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isNamingModal}
      onRequestClose={() => setIsNamingModal((curr) => !curr)}
    >
      <View className="flex-1 justify-center items-center">
        <View
          className="m-8 bg-white rounded-lg p-5 shadow"
          style={styles.modalView}
        >
          <View className="flex-row items-center justify-between mb-3 w-full">
            <Text className="mr-6 text-[16px]">Save Signed Document</Text>
            <TouchableOpacity
              className={`bg-[#e6867a] rounded-full p-2`}
              onPress={() => setIsNamingModal((curr) => !curr)}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              ref={renameRef}
              placeholder="Document Name"
              onChangeText={(text) => setNewName(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row items-center justify-between my-3 w-full">
            <TouchableOpacity
              className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
            >
              <Text className="text-[16px] text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsNamingModal(false)}
              className={`rounded-lg bg-slate-200 py-3 px-6`}
            >
              <Text className="text-[16px]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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

import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as FileSystem from "expo-file-system";
// UI
import { TextInput } from "react-native";
import { Context } from "../contexts/Global";
import { updateDocuments } from "../functions/Global";

export const RenameDocumentModal = ({
  docName,
  setDocName,
  docPath,
  setDocPath,
  showRenameModal,
  setShowRenameModal,
}) => {
  const renameRef = useRef();
  const [newName, setNewName] = useState(null);
  const { setDocList, setFilteredDocList } = useContext(Context);

  useEffect(() => {
    // Auto focus on the rename field
    renameRef.current.focus();
  }, []);

  async function renameDocument() {
    if (newName === null) return;

    // Split path and file name

    const onlyPath = docPath.split(docName)[0];
    const newPath = onlyPath + newName.trim() + ".pdf";

    try {
      await FileSystem.moveAsync({
        from: docPath,
        to: newPath,
      });
    } catch (err) {
      console.log("Error while renaming file: ", err);
    }
    // TODO: Figure out a better flow
    setDocName(newName + ".pdf");
    setDocPath(newPath);
    updateDocuments(setDocList, setFilteredDocList);
    setShowRenameModal((curr) => !curr);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showRenameModal}
      onRequestClose={() => setShowRenameModal((curr) => !curr)}
    >
      <View className="flex-1 justify-center items-center">
        <View
          className="m-8 bg-white rounded-lg p-5 shadow"
          style={styles.modalView}
        >
          <View className="flex-row items-center justify-between mb-3 w-full">
            <Text className="mr-6">Rename Document</Text>
            <TouchableOpacity
              className={`bg-[#e6867a] rounded-full p-2`}
              onPress={() => setShowRenameModal((curr) => !curr)}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              ref={renameRef}
              placeholder={docName.split(".")[0]}
              onChangeText={(text) => setNewName(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row my-3 w-full">
            <TouchableOpacity onPress={renameDocument}>
              <Text className="text-[16px]">Save</Text>
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

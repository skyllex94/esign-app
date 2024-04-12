import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
// UI
import { TextInput } from "react-native";
import { Context } from "../contexts/Global";
import { updateDocuments } from "../functions/Global";
import { actionButton } from "../../constants/UI";

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
      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setShowRenameModal(false);
        }}
      />

      <View className="flex-1 justify-center items-center">
        <View className="m-8 bg-white rounded-lg p-5 shadow">
          <View className="flex-row items-center justify-between mb-3 w-full">
            <Text className="mr-6">Rename Document</Text>
          </View>

          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              ref={renameRef}
              placeholder={docName.split(".")[0]}
              onChangeText={(text) => setNewName(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row justify-between mt-2">
            <TouchableOpacity
              onPress={renameDocument}
              className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
            >
              <Text className="text-[16px] text-white">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRenameModal(false)}
              className={`rounded-lg bg-slate-200 py-3 px-10`}
            >
              <Text className="text-[16px]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setShowRenameModal(false);
        }}
      />
    </Modal>
  );
};

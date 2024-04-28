import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { actionButton } from "../../constants/UI";
import { createFolder, updateList } from "../functions/Global";
import { Context } from "../contexts/Global";

export default function NewFolderModal({
  currPath,
  setCurrPath,
  showNewFolderModal,
  setShowNewFolderModal,
}) {
  const folderNameRef = useRef();
  const [folderName, setFolderName] = useState("");
  const { setScanList, setFilteredScanList } = useContext(Context);

  useEffect(() => {
    folderNameRef.current.focus();
  }, []);

  function createNewFolder(name) {
    if (name === "") return;

    createFolder(currPath, setCurrPath, name, setScanList, setFilteredScanList);

    setShowNewFolderModal(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showNewFolderModal}
      onRequestClose={() => setShowNewFolderModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowNewFolderModal(false)}
      />

      <View className="flex-1 justify-center items-center">
        <View className="m-8 bg-white rounded-lg p-5 shadow">
          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              ref={folderNameRef}
              placeholder="Folder Name"
              onChangeText={(text) => setFolderName(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row items-center justify-between my-3 w-full">
            <TouchableOpacity
              onPress={() => createNewFolder(folderName)}
              className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
            >
              <Text className="text-[16px] text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowNewFolderModal(false)}
              className={`rounded-lg bg-slate-200 py-3 px-6`}
            >
              <Text className="text-[16px]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowNewFolderModal(false)}
      />
    </Modal>
  );
}

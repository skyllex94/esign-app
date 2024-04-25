import { useState, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { actionButton } from "../../constants/UI";
import { showMessage } from "react-native-flash-message";
import { updateDocuments } from "../functions/Global";
import { Context } from "../contexts/Global";
import { createPdf } from "react-native-images-to-pdf";
import { directoryExists } from "../Sign/functions";
import RNFS from "react-native-fs";
import { deleteResidualFiles } from "./functions";

export default function NameScanModal({
  showNameDocument,
  setShowNameDocument,
  scannedImages,
}) {
  const [name, setName] = useState("");
  const { setScanList, setFilteredScanList } = useContext(Context);

  async function saveScannedDocument() {
    try {
      if (!scannedImages) return;

      // Check directory and create if missing
      directoryExists("Scanned");

      const scannedDocPath = `${RNFS.DocumentDirectoryPath}/Scanned/`;

      // Convert the camera images into pdf files
      const savedScannedDocument = await createPdf({
        pages: scannedImages.map((imagePath) => ({ imagePath })),
        outputPath: `file://${scannedDocPath}${name}.pdf`,
      });
      console.log("savedScannedDocument:", savedScannedDocument);

      // Delete the images created from the scanner
      deleteResidualFiles(scannedImages);

      // Update list with scanned documents
      updateDocuments("Scanned", setScanList, setFilteredScanList);

      setShowNameDocument(false);
    } catch (err) {
      showMessage({
        message: "Error while saving document",
        description: err.toString(),
        duration: 5000,
        type: "danger",
      });
    }
  }

  async function cancelScannedDocument() {
    deleteResidualFiles(scannedImages);
    setShowNameDocument(false);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showNameDocument}
      onRequestClose={() => setShowNameDocument((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowNameDocument(false)}
      />

      <View className="flex-1 justify-center items-center">
        <View className="m-8 bg-white rounded-lg p-5 shadow">
          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              // ref={renameRef}
              placeholder="Document Name..."
              onChangeText={(text) => setName(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row items-center justify-between my-3 w-full">
            <TouchableOpacity
              onPress={() => saveScannedDocument()}
              className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
            >
              <Text className="text-[16px] text-white">Save</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={cancelScannedDocument}
              className={`rounded-lg bg-slate-200 py-3 px-6`}
            >
              <Text className="text-[16px]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="flex-1"
        onPress={() => setShowNameDocument(false)}
      />
    </Modal>
  );
}

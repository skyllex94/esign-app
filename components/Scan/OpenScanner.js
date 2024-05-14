import React, { useState } from "react";
import DocumentScanner from "react-native-document-scanner-plugin";
import { showMessage } from "react-native-flash-message";

import { Text, TouchableOpacity, View } from "react-native";
import { actionButton } from "../../constants/UI";
import { MaterialIcons } from "@expo/vector-icons";
import NameScanModal from "./NameScanModal";
import useRevenueCat from "../../hooks/useRevenueCat";

import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

export default function OpenScanner({
  navigation,
  setShowNewFolderModal,
  setIsEditDocument,
}) {
  const [scannedImages, setScannedImages] = useState();
  const [showNameDocument, setShowNameDocument] = useState(false);

  const { isProMember } = useRevenueCat();

  const openCameraScanner = async () => {
    try {
      // Open document scanner
      const { scannedImages } = await DocumentScanner.scanDocument();
      if (!scannedImages?.length) return;

      setScannedImages(scannedImages);
      setShowNameDocument(true);
    } catch (err) {
      showMessage({
        message: "Error occurred while saving document",
        description: err.toString(),
        duration: 5000,
        type: "danger",
      });
    }
  };

  return (
    <View className="flex-row items-center justify-center rounded-lg">
      <View className="flex-row items-center justify-center gap-y-1 mb-2 rounded-lg w-full">
        <TouchableOpacity
          onPress={() => setShowNewFolderModal(true)}
          className={`absolute left-0 items-center justify-center z-2 bg-white p-3
          rounded-full w-[33%] h-[55px]`}
        >
          <View className="pr-4 items-center justify-center">
            <MaterialIcons name="folder" size={24} color="black" />
            <Text>Folder</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={
            isProMember
              ? openCameraScanner
              : () => navigation.navigate("Paywall")
          }
          className={`flex-row items-center justify-center bg-[${actionButton}]
            z-20 w-[50%] h-[75px] rounded-full`}
        >
          <MaterialIcons name="document-scanner" size={25} color="white" />
          <Text className="pl-2 text-white">Camera Scan</Text>
        </TouchableOpacity>

        <View
          className={`absolute items-center justify-center top-[-8] z-10 bg-[#f2f2f2] 
              rounded-full w-[55%] h-[91px]`}
        />

        <TouchableOpacity
          onPress={() => {
            setIsEditDocument(true);

            showMessage({
              message: "Choose a document to edit.",
              color: "white",
              backgroundColor: actionButton,
              duration: 1000,
            });
          }}
          className={`absolute right-0 items-center justify-center z-4 bg-white p-3 
            rounded-full w-[33%] h-[55px]`}
        >
          <View className="pl-4 items-center justify-center">
            <MaterialIcons name="edit-document" size={24} color="black" />
            <Text>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>

      {showNameDocument && (
        <NameScanModal
          showNameDocument={showNameDocument}
          setShowNameDocument={setShowNameDocument}
          scannedImages={scannedImages}
        />
      )}
    </View>
  );
}

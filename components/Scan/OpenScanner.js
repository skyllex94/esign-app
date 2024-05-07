import React, { useState } from "react";
import DocumentScanner from "react-native-document-scanner-plugin";
import { showMessage } from "react-native-flash-message";

import { Text, TouchableOpacity, View } from "react-native";
import { actionButton } from "../../constants/UI";
import { MaterialIcons } from "@expo/vector-icons";
import NameScanModal from "./NameScanModal";

export default function OpenScanner() {
  const [scannedImages, setScannedImages] = useState();
  const [showNameDocument, setShowNameDocument] = useState(false);

  const openCameraScanner = async () => {
    try {
      // Open document scanner
      const { scannedImages } = await DocumentScanner.scanDocument();
      if (!scannedImages?.length) return;

      setScannedImages(scannedImages);
      setShowNameDocument(true);
    } catch (err) {
      showMessage({
        message: "Error occured while saving document",
        description: err.toString(),
        duration: 5000,
        type: "danger",
      });
    }
  };

  return (
    <View className="flex-row items-center justify-center rounded-lg">
      <TouchableOpacity
        onPress={openCameraScanner}
        className={`flex-row items-center justify-center bg-[${actionButton}]
            z-20 w-[98%] h-[55px] rounded-full mt-3`}
      >
        <MaterialIcons name="document-scanner" size={25} color="white" />
        <Text className="pl-2 text-white">Scan</Text>
      </TouchableOpacity>

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

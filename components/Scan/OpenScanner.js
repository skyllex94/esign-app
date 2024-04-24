import React, { useState } from "react";
import DocumentScanner from "react-native-document-scanner-plugin";
import { showMessage } from "react-native-flash-message";

import { Text, TouchableOpacity, View } from "react-native";
import { actionButton } from "../../constants/UI";
import { AntDesign } from "@expo/vector-icons";
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
    <React.Fragment>
      <TouchableOpacity
        onPress={openCameraScanner}
        className={`flex-row items-center justify-center bg-[${actionButton}]
            z-20 w-[50%] h-[75px] rounded-full`}
      >
        <AntDesign name="plus" size={30} color="white" />
        <Text className="pl-2 text-white">Scan</Text>
      </TouchableOpacity>

      <View
        className={`absolute items-center justify-center top-[-8] z-10 bg-[#f2f2f2] 
              rounded-full w-[55%] h-[91px]`}
      />

      {showNameDocument && (
        <NameScanModal
          showNameDocument={showNameDocument}
          setShowNameDocument={setShowNameDocument}
          scannedImages={scannedImages}
        />
      )}
    </React.Fragment>
  );
}

{
  /* <Image
      resizeMode="contain"
      style={{ width: "100%", height: "100%" }}
      source={{ uri: scannedImage }}
    /> */
}

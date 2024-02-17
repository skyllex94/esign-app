import { View, Text, SafeAreaView, Button } from "react-native";
import React, { useRef } from "react";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";

export default function DrawSignCapture() {
  const signature = useRef();

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log("dragged");
  };

  function saveSignature(result) {
    // result.encoded - for the base64 encoded png
    // result.pathName - for the file path name
    console.log(result.pathName);
    console.log(result.encoded);
    alert("Signature Captured");
  }

  return (
    <SafeAreaView className="flex-1">
      <View>
        <SignatureCapture
          style={{ width: "100%", height: 314 }}
          ref={signature}
          saveImageFileInExtStorage={true}
          viewMode={"portrait"}
          showTitleLabel={false}
          showNativeButtons={false}
          onDragEvent={_onDragEvent}
          onSaveEvent={saveSignature}
        />

        <View className="flex-row justify-between p-4">
          <Button
            className="p-3"
            color="#007AFF"
            onPress={() => signature.current.saveImage()}
            title="Save Signature"
          />
          <Button
            className="p-3"
            color="#007AFF"
            onPress={() => signature.current.resetImage()}
            title="Clear Signature"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

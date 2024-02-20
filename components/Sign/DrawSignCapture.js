import { View, Text, SafeAreaView, Button } from "react-native";
import React, { useRef } from "react";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";
import RNFetchBlob from "rn-fetch-blob";
import * as MediaLibrary from "expo-media-library";

export default function DrawSignCapture() {
  const signature = useRef();
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log("dragged");
  };

  async function saveSignature(result) {
    // result.encoded - for the base64 encoded png
    // result.pathName - for the file path name

    // Append the path with file:// to use it for further operations.

    const resp = MediaLibrary.requestPermissionsAsync();
    console.log("resp:", resp);
    const per = permissionResponse;
    console.log("per:", per);

    const dirs = RNFetchBlob.fs.dirs;
    console.log(dirs);

    const filePath =
      dirs.DocumentDir +
      "/SimpleSign" +
      "/signature" +
      new Date().getMilliseconds() +
      ".png";

    console.log("filePath:", filePath);

    RNFetchBlob.fs
      .writeFile(filePath, result.encoded, "base64")
      .then((res) => {
        console.log(res);
        // RNFetchBlob.ios.openDocument(filePath);
        RNFetchBlob.ios.previewDocument("file://" + filePath);

        console.log("Successfully saved to: " + filePath);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });
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

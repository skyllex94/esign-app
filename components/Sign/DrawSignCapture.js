import { View, Text, SafeAreaView, Button } from "react-native";
import React, { useEffect, useRef, useState } from "react";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";
import RNFetchBlob from "rn-fetch-blob";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";

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
      "signature" +
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

  const [docList, setDocList] = useState([]);

  useEffect(() => {
    getAllFilesFromAppDirectory();
  }, []);

  async function getAllFilesFromAppDirectory() {
    let dir = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "SimpleSign"
    );

    dir.forEach((val) => {
      docList.push(FileSystem.documentDirectory + "/" + val);
    });

    setDocList(docList);
  }

  async function readSignature() {
    const filePath =
      "/var/mobile/Containers/Data/Application/B663545B-1B1F-4538-89AD-8586D121D815/Documents/SimpleSign/signature906.png";

    // RNFetchBlob.fs.readFile(filePath, "base64").then((res) => {
    //   console.log("READING FILE:", res);
    // });

    const result = await FileSystem.getInfoAsync(filePath);
    console.log("result:", result);
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
          <Button
            className="p-3"
            color="#007AFF"
            onPress={readSignature}
            title="Read File"
          />
        </View>
      </View>
      <ScrollView className="flex-1">
        {docList.map((val, key) => (
          <Text key={key}>{val}</Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

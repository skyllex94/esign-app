import {
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// UI Imports
import { FontAwesome6 } from "@expo/vector-icons";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";
import RNFetchBlob from "rn-fetch-blob";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";

export default function DrawSignCapture() {
  const signature = useRef();
  const [signatureList, setSignatureList] = useState([]);

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

  useEffect(() => {
    displayStoredSignatures();
  }, []);

  async function displayStoredSignatures() {
    let dir = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory + "SimpleSign"
    );

    dir.forEach((val) => {
      signatureList.push(FileSystem.documentDirectory + "SimpleSign/" + val);
    });

    setSignatureList(() => [...signatureList]);
  }

  async function readSignature() {
    const filePath =
      "/var/mobile/Containers/Data/Application/1B2A4A62-7CF1-4FF2-B75B-93420F938CE3/Documents/SimpleSign/signature959.png";

    // RNFetchBlob.fs.readFile(filePath, "base64").then((res) => {
    //   console.log("READING FILE:", res);
    // });

    const result = await FileSystem.getInfoAsync(filePath);
    console.log("result:", result);
  }

  function hideSignatures() {
    setSignatureList(() => []);
  }

  console.log(signatureList);

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
        <View className="flex-row justify-center">
          <Button
            className="p-3"
            color="#007AFF"
            onPress={displayStoredSignatures}
            title="Display All Signatures"
          />
          <Button
            className="p-3"
            color="#007AFF"
            onPress={hideSignatures}
            title="Hide Signatures"
          />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
      >
        <View className="flex-row items-center">
          <TouchableOpacity className="border-2 p-2 mt-6 mx-2 rounded-full">
            <FontAwesome6 name="add" size={24} color="black" />
          </TouchableOpacity>
          {signatureList.map((val, key) => (
            <TouchableOpacity
              key={key}
              className="p-1 mx-1 mt-6 bg-slate-50 border-slate-300 border-2 rounded-lg"
            >
              <Image className="h-10 w-20 " source={{ uri: val }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

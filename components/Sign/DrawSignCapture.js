import {
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
// UI Imports
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";
import ReactNativeBlobUtil from "react-native-blob-util";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";

export default function DrawSignCapture() {
  const signature = useRef();
  const [signatureList, setSignatureList] = useState([]);

  useEffect(() => {
    displayStoredSignatures();
  }, []);

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log("dragged");
  };

  async function saveSignature(signature) {
    // signature.encoded - for the base64 encoded png
    // signature.pathName - for the file path name

    const dirs = ReactNativeBlobUtil.fs.dirs;

    const filePath =
      dirs.DocumentDir +
      "/SimpleSign" +
      "/signature" +
      new Date().getMilliseconds() +
      ".png";

    ReactNativeBlobUtil.fs
      .writeStream(filePath, "base64")
      .then((data) => data.write(signature.encoded))
      .then(() => {
        // ReactNativeBlobUtil.ios.openDocument(filePath);
        // ReactNativeBlobUtil.ios.previewDocument("file://" + filePath);
        console.log("Successfully saved to: " + filePath);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });

    // Include filePath into the signature array
    signatureList.push(filePath);
    setSignatureList([...signatureList]);
  }

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

    const signature = await FileSystem.getInfoAsync(filePath);
    console.log("signature:", signature);
  }

  function hideSignatures() {
    setSignatureList(() => []);
  }

  function deleteSignature(fileWtPath) {
    const path = fileWtPath.split("//");

    // Updating signature array list for the UI
    const updatedSignatureList = signatureList.filter(
      (signature) => signature !== fileWtPath
    );

    ReactNativeBlobUtil.fs
      .unlink(path[1])
      .then(() => {
        console.log("Deleted File from - ", path[1]);
      })
      .catch((err) => console.log(err));

    setSignatureList(() => [...updatedSignatureList]);

    // return Alert.alert(
    //   "Are your sure?",
    //   "Are you sure you want to delete this signature?",
    //   [
    //     // The "Yes" button
    //     {
    //       text: "Yes",
    //       onPress: () => {

    //       },
    //     },

    //     {
    //       text: "No",
    //     },
    //   ]
    // );
  }

  async function selectSignature(signatureFilePath) {
    const info = await FileSystem.getInfoAsync(signatureFilePath);
    ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
    console.log(info);
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
        className="flex-1"
      >
        <View className="flex-row items-start">
          <TouchableOpacity className="border-2 p-2 mt-7 mx-2 rounded-full">
            <FontAwesome6 name="add" size={24} color="black" />
          </TouchableOpacity>
          {signatureList.map((path, idx) => (
            <View
              key={idx}
              className="flex-row items-start mx-1 mt-6 bg-slate-50 border-slate-300 border-2 rounded-lg"
            >
              <TouchableOpacity
                onPress={() => selectSignature(path)}
                className="flex-row p-1 "
              >
                <Image className="h-12 w-24" source={{ uri: path }} />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute"
                onPress={() => deleteSignature(path)}
              >
                <Ionicons name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

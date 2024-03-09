import {
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
// UI Imports
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";
import ReactNativeBlobUtil from "react-native-blob-util";
import * as FileSystem from "expo-file-system";
import { ScrollView } from "react-native-gesture-handler";
import { Context } from "../contexts/Global";
import {
  deleteSignature,
  displayStoredSignatures,
  hideSignatures,
} from "./functions";

export default function DrawSignCapture() {
  const signature = useRef();
  const [signatureColor, setSignatureColor] = useState("black");
  const [updateSignatureCapture, setUpdateSignatureCapture] = useState(true);

  const { signatureList, setSignatureList, bottomSheetChooseDocument } =
    useContext(Context);

  useEffect(() => {
    displayStoredSignatures(setSignatureList);
    console.log("USEEFFECTsignatureList", signatureList);
    bottomSheetChooseDocument.current.dismiss();
  }, []);

  async function saveSignature(signature) {
    // signature.encoded - for the base64 encoded png
    // signature.pathName - for the file path name

    const dirs = ReactNativeBlobUtil.fs.dirs;

    const filePath =
      dirs.DocumentDir +
      "/Signatures" +
      "/signature" +
      new Date().getMilliseconds() +
      ".png";

    console.log("filePath:", filePath);

    ReactNativeBlobUtil.fs
      .writeStream(filePath, "base64")
      .then((data) => data.write(signature.encoded))
      .then(() => {
        // ReactNativeBlobUtil.ios.previewDocument("file://" + filePath);
        console.log("Successfully saved to: " + filePath);
      })
      .catch((errorMessage) => {
        console.log(errorMessage);
      });

    // Include filePath into the signature array
    setSignatureList([...signatureList, filePath]);
    displayStoredSignatures(setSignatureList);
  }

  async function readSignature() {
    const filePath =
      "/var/mobile/Containers/Data/Application/1B2A4A62-7CF1-4FF2-B75B-93420F938CE3/Documents/Signatures/signature959.png";

    const signature = await FileSystem.getInfoAsync(filePath);
    console.log("signature:", signature);
  }

  async function previewSignature(signatureFilePath) {
    ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
  }

  console.log(signatureColor);

  function changeSignatureColor(color) {
    if (color === signatureColor) return;
    setSignatureColor(color);
    setUpdateSignatureCapture(false);
  }

  useEffect(() => {
    setUpdateSignatureCapture(true);
  }, [signatureColor]);

  return (
    <SafeAreaView className="flex-1">
      <View>
        {updateSignatureCapture ? (
          <SignatureCapture
            style={{ width: "100%", height: 344 }}
            ref={signature}
            saveImageFileInExtStorage={true}
            viewMode={"portrait"}
            showTitleLabel={false}
            showNativeButtons={false}
            onSaveEvent={saveSignature}
            strokeColor={signatureColor}
          />
        ) : (
          <View className="h-[314px]" />
        )}

        <View className="flex-row absolute left-5 top-5 justify-end">
          <TouchableOpacity
            className="h-8 w-8 bg-black rounded-full mx-1"
            onPress={() => changeSignatureColor("black")}
          />
          <TouchableOpacity
            className="h-8 w-8 bg-[#0047ab] rounded-full mx-1"
            onPress={() => changeSignatureColor("#0047ab")}
          />
          <TouchableOpacity
            className="h-8 w-8 bg-[#4F7942] rounded-full mx-1"
            onPress={() => changeSignatureColor("#4F7942")}
          />
        </View>

        <View className="line justify-center absolute w-[90%] left-5 top-60">
          <View className="border-[0.5px] border-dashed border-gray-500"></View>
        </View>

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
            onPress={() => displayStoredSignatures(setSignatureList)}
            title="Display All Signatures"
          />
          <Button
            className="p-3"
            color="#007AFF"
            onPress={() => hideSignatures(setSignatureList)}
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
                onPress={() => previewSignature(path)}
                className="flex-row p-1 "
              >
                <Image className="h-12 w-24" source={{ uri: path }} />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute"
                onPress={() =>
                  deleteSignature(path, signatureList, setSignatureList)
                }
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

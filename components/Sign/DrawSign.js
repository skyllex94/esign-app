import {
  View,
  SafeAreaView,
  Button,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
// UI Imports
import {
  AntDesign,
  EvilIcons,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";
import ReactNativeBlobUtil from "react-native-blob-util";
import { ScrollView } from "react-native-gesture-handler";
import { Context } from "../contexts/Global";
import { deleteSignature, loadStoredSignatures } from "./functions";
import Checkbox from "expo-checkbox";
import { actionButton } from "../../constants/UI";
import * as FileSystem from "expo-file-system";
import { SignatureDetails } from "./SignatureDetails";
import { openDocument } from "../functions/Global";
import { signatureCanvasHeight } from "../../constants/Utils";

export default function DrawSignCapture({ navigation }) {
  const signature = useRef();
  const [signatureColor, setSignatureColor] = useState("black");
  const [updateSignatureCapture, setUpdateSignatureCapture] = useState(true);

  // Signature Details Modal
  const [signatureDetailsModal, setSignatureDetailsModal] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState(null);

  const [checked, setChecked] = useState(false);

  const { signatureList, setSignatureList, bottomSheetChooseDocument } =
    useContext(Context);

  useEffect(() => {
    bottomSheetChooseDocument.current.dismiss();
  }, []);

  // Needed to update when signature color is changed
  useEffect(() => {
    setUpdateSignatureCapture(true);
  }, [signatureColor]);

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
    loadStoredSignatures(setSignatureList);
  }

  async function previewSignature(signatureFilePath) {
    ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
  }

  function changeSignatureColor(color) {
    if (color === signatureColor) return;
    setSignatureColor(color);
    setUpdateSignatureCapture(false);
  }

  function addNewSignature() {
    signature.current.saveImage();
    signature.current.resetImage();
  }

  async function showSignatureDetails(path) {
    const signatureInfo = await FileSystem.getInfoAsync(path);
    setDetailsInfo(signatureInfo);
    setSignatureDetailsModal((curr) => !curr);
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="flex-row items-center m-3"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg mx-1">Back</Text>
        </TouchableOpacity>

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
            title="Clear"
          />
        </View>
      </View>

      <View>
        {updateSignatureCapture ? (
          <SignatureCapture
            style={{ width: "100%", height: signatureCanvasHeight }}
            ref={signature}
            saveImageFileInExtStorage={true}
            viewMode={"portrait"}
            showTitleLabel={false}
            showNativeButtons={false}
            onSaveEvent={saveSignature}
            strokeColor={signatureColor}
          />
        ) : (
          <View className="h-[344px]" />
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

        <View className="line justify-center absolute w-[90%] left-5 top-64">
          <View className="border-[0.5px] border-dashed border-gray-500"></View>
        </View>
      </View>
      <View className="flex-1 m-4">
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-lg">My Signatures</Text>

          <TouchableOpacity
            onPress={addNewSignature}
            className="bg-slate-50 border-slate-400 rounded-lg p-2 mx-1"
          >
            <FontAwesome6 name="add" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="mt-2">
          <View className="flex-1 mt-2">
            {signatureList.map((path, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between my-1 w-full bg-slate-50 border-gray-300 rounded-lg"
              >
                <TouchableOpacity>
                  <Checkbox
                    className={`${
                      !checked && "border-gray-400"
                    } ml-4 p-2 rounded-full`}
                    color={actionButton}
                    value={checked}
                    onValueChange={setChecked}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row justify-center items-center p-1 ml-4 w-60"
                  onPress={() => previewSignature(path)}
                >
                  <Image className="h-12 w-20" source={{ uri: path }} />
                </TouchableOpacity>

                <View className="flex-row items-center">
                  <TouchableOpacity onPress={() => showSignatureDetails(path)}>
                    <MaterialIcons name="more-horiz" size={24} color="gray" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="ml-2 mr-3"
                    onPress={() =>
                      deleteSignature(path, signatureList, setSignatureList)
                    }
                  >
                    <AntDesign name="close" size={22} color="gray" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {signatureDetailsModal && (
          <SignatureDetails
            detailsInfo={detailsInfo}
            signatureDetailsModal={signatureDetailsModal}
            setSignatureDetailsModal={setSignatureDetailsModal}
          />
        )}

        <View className="mt-3">
          <TouchableOpacity
            onPress={() =>
              openDocument(navigation, signatureList, bottomSheetChooseDocument)
            }
            className={`bg-[${actionButton}] items-center justify-center rounded-lg h-12 w-full`}
          >
            <Text className="text-white text-[15px] font-bold">
              Open Document
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

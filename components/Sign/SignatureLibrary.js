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
import ReactNativeBlobUtil from "react-native-blob-util";
import { ScrollView } from "react-native-gesture-handler";
import { Context } from "../contexts/Global";
import { deleteSignature } from "./functions";
import Checkbox from "expo-checkbox";
import { actionButton } from "../../constants/UI";
import * as FileSystem from "expo-file-system";
import { SignatureDetails } from "./SignatureDetails";
import { openDocument } from "../functions/Global";
import SignatureCanvas from "./SignatureCanvas";

export default function DrawSignCapture({ navigation }) {
  // Signature Details Modal
  const [signatureDetailsModal, setSignatureDetailsModal] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState(null);

  const [checked, setChecked] = useState(false);

  const { signatureList, setSignatureList, bottomSheetChooseDocument } =
    useContext(Context);

  useEffect(() => {
    bottomSheetChooseDocument.current.dismiss();
  }, []);

  async function previewSignature(signatureFilePath) {
    ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
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
      <SignatureCanvas navigation={navigation} />

      <View className="flex-1 m-4">
        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-lg">My Signatures</Text>

          <TouchableOpacity
            // onPress={addNewSignature}
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

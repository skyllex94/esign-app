import { View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
// UI Imports
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
// Signature Imports
import ReactNativeBlobUtil from "react-native-blob-util";
import { ScrollView } from "react-native-gesture-handler";
import { Context } from "../contexts/Global";
import { deleteSignature } from "./functions";
import * as FileSystem from "expo-file-system";
import { SignatureDetails } from "./SignatureDetails";
import DrawingCanvas from "./DrawingCanvas";

export default function DrawSignCapture({ navigation }) {
  // Signature Details Modal
  const [signatureDetailsModal, setSignatureDetailsModal] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState(null);

  const {
    signatureList,
    setSignatureList,
    bottomSheetChooseDocument,
    librarySheet,
  } = useContext(Context);

  useEffect(() => {
    bottomSheetChooseDocument?.current.dismiss();
    librarySheet?.current.dismiss();
  }, []);

  async function previewSignature(signatureFilePath) {
    ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
  }

  async function showSignatureDetails(path) {
    const signatureInfo = await FileSystem.getInfoAsync(path);
    setDetailsInfo(signatureInfo);
    setSignatureDetailsModal((curr) => !curr);
  }

  return (
    <SafeAreaView className="flex-1">
      <DrawingCanvas navigation={navigation} />

      <View className="flex-1 mx-3 mb-2">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-1">
            {signatureList.map((path, idx) => (
              <View
                key={idx}
                className="flex-row items-center justify-between my-1 w-full bg-slate-50 border-gray-300 rounded-lg"
              >
                <TouchableOpacity>
                  <TouchableOpacity
                    className="ml-2 mr-3"
                    onPress={() =>
                      deleteSignature(path, signatureList, setSignatureList)
                    }
                  >
                    <AntDesign name="close" size={22} color="gray" />
                  </TouchableOpacity>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row justify-center items-center p-1 ml-4 w-60"
                  onPress={() => previewSignature(path)}
                >
                  <Image
                    key={path}
                    className="h-12 w-20"
                    source={{ uri: path }}
                  />
                </TouchableOpacity>

                <View className="flex-row items-center ml-2 mr-3">
                  <TouchableOpacity onPress={() => showSignatureDetails(path)}>
                    <MaterialIcons name="more-horiz" size={24} color="gray" />
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
      </View>
    </SafeAreaView>
  );
}

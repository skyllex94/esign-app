import { View, Text, StatusBar } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Context } from "../contexts/Global";
import {
  AntDesign,
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import ReactNativeBlobUtil from "react-native-blob-util";
import {
  emailDocument,
  emailToThirdParty,
  openShareOptions,
} from "./functions";
import * as Print from "expo-print";
import * as StoreReview from "expo-store-review";

export default function DocumentSuccess({ route, navigation }) {
  const animation = useRef(null);
  const { editedDocPath } = route.params;
  const name = editedDocPath?.split("Completed/")[1];
  const { bottomSheetChooseDocument } = useContext(Context);

  async function previewDocument() {
    ReactNativeBlobUtil.ios.openDocument(editedDocPath);
  }

  useEffect(() => {
    bottomSheetChooseDocument.current.dismiss();
  }, []);

  async function printEditedDocument() {
    try {
      // Print the document
      const { uri } = await Print.printAsync({ uri: editedDocPath });
      console.log("File has been saved to:", uri);
    } catch (err) {
      // Leaving it empty since cancel triggers a warning
    }
  }

  function askForReview() {
    navigation.navigate("MainSignScreen");

    setTimeout(async () => {
      if (await StoreReview.hasAction()) {
        StoreReview.requestReview();
      }
    }, 2000);
  }

  return (
    <SafeAreaView className="mx-4 gap-y-5">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row pt-2 justify-end">
        <TouchableOpacity
          className={`bg-slate-300 rounded-full p-2`}
          onPress={askForReview}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="items-center justify-center">
        <LottieView
          autoPlay
          ref={animation}
          style={{ width: 200, height: 200 }}
          source={require("../../assets/lottie/success.json")}
        />
        <Text className="text-lg font-bold">Document Saved!</Text>
      </View>

      <Text className="text-[16px] mx-2">What's Next?</Text>
      <ScrollView className="h-full" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-lg">
          <TouchableOpacity
            onPress={previewDocument}
            className="flex-row items-center p-4 border-b-[0.5px] border-gray-300"
          >
            <Fontisto name="preview" size={20} color="black" />
            <Text className="mx-3">View Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => emailDocument(editedDocPath)}
            className="flex-row items-center p-4 border-b-[0.5px] border-gray-300"
          >
            <MaterialCommunityIcons
              name="email-plus-outline"
              size={22}
              color="black"
            />
            <Text className="mx-3">Email to recipient(s)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => emailToThirdParty(editedDocPath, name)}
            className="flex-row items-center p-4 border-b-[0.5px] border-gray-300"
          >
            <MaterialCommunityIcons
              name="email-plus-outline"
              size={22}
              color="black"
            />
            <Text className="mx-3">Email to Third Party</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => printEditedDocument()}
            className="flex-row items-center p-4 border-b-[0.5px] border-gray-300"
          >
            <Ionicons name="print-outline" size={24} color="black" />
            <Text className="mx-3">Print Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openShareOptions(editedDocPath)}
            className="flex-row items-center p-4"
          >
            <Feather name="share" size={22} color="black" />
            <Text className="mx-3">Share / Save to Files</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

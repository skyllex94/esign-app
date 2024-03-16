import { View, Text, StatusBar, Share } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Context } from "../contexts/Global";
import * as MailComposer from "expo-mail-composer";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { shareAsync } from "expo-sharing";
import { showMessage } from "react-native-flash-message";
import ReactNativeBlobUtil from "react-native-blob-util";

export default function DocumentSuccess({ route, navigation }) {
  const animation = useRef(null);
  const { editedDocPath } = route.params;
  const name = editedDocPath?.split("Completed/")[1];
  const { bottomSheetChooseDocument } = useContext(Context);

  console.log("editedDocPath:", editedDocPath);

  async function openShareOptions() {
    await shareAsync(editedDocPath, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  }

  async function emailDocument() {
    const canUseMailService = await MailComposer.isAvailableAsync();

    if (canUseMailService === false) {
      showMessage({
        message: "Email Service cannot be used",
        description: "The email cannot be used on this device unfortunately.",
        duration: 3000,
        type: "danger",
      });
      return;
    }

    try {
      await MailComposer.composeAsync({
        subject: "Document to be Signed",
        body: "Here's the signed document for you to review/have. Signed via SimpleSign™.",
        attachments: editedDocPath,
      });
    } catch (err) {
      showMessage({
        message: "Error Occured",
        description: err.toString(),
        duration: 3000,
        type: "danger",
      });
    }
  }

  async function emailToThirdParty() {
    const canUseMailService = await MailComposer.isAvailableAsync();

    if (canUseMailService === false) {
      showMessage({
        message: "Email Service cannot be used",
        description: "The email cannot be used on this device unfortunately.",
        duration: 3000,
        type: "danger",
      });
      return;
    }

    try {
      await MailComposer.composeAsync({
        subject: `Signed Document`,
        body: `Here's the signed document - ${name} for you to review/have. Signed via SimpleSign™.`,
        attachments: editedDocPath,
      });
    } catch (err) {
      showMessage({
        message: "Error Occured",
        description: err.toString(),
        duration: 3000,
        type: "danger",
      });
    }
  }

  async function openSharingOptions() {}

  async function previewDocument() {
    ReactNativeBlobUtil.ios.openDocument(editedDocPath);
  }

  useEffect(() => {
    bottomSheetChooseDocument.current.dismiss();
  }, []);

  return (
    <SafeAreaView className="mx-4 gap-y-8">
      <StatusBar barStyle="dark-content" />
      <View className="items-center justify-center">
        <LottieView
          autoPlay
          ref={animation}
          style={{ width: 200, height: 200 }}
          source={require("../../assets/lottie/success.json")}
        />
        <Text className="text-lg font-bold">Document Saved!</Text>
      </View>

      <ScrollView className="h-full" showsVerticalScrollIndicator={false}>
        <Text className="text-[16px] m-3">What's Next?</Text>
        <View className="bg-white rounded-lg">
          <TouchableOpacity
            onPress={previewDocument}
            className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
          >
            <Ionicons name="document-text-outline" size={24} color="black" />
            <Text className="mx-2">View Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={emailDocument}
            className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
          >
            <MaterialCommunityIcons
              name="email-fast-outline"
              size={24}
              color="black"
            />
            <Text className="mx-2">Email to Recipient(s)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={emailToThirdParty}
            className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
          >
            <MaterialCommunityIcons
              name="email-fast-outline"
              size={24}
              color="black"
            />
            <Text className="mx-2">Email to Third Party</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openShareOptions}
            className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
          >
            <FontAwesome6 name="copy" size={24} color="black" />
            <Text className="mx-2">Save a Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openSharingOptions}
            className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
          >
            <FontAwesome6 name="share-square" size={24} color="black" />
            <Text className="mx-2">Share through...</Text>
          </TouchableOpacity>
        </View>

        {/* 
          <View className="mt-4">
              <Text className="text-[16px] m-3">Go To:</Text>
              <View className="bg-white rounded-lg">
                <TouchableOpacity
                  onPress={() => navigation.navigate("SignBottomSheet")}
                  className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
                >
                  <Ionicons name="document-text-outline" size={24} color="black" />
                  <Text className="mx-2">All Documents</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("SignBottomSheet")}
                  className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
                >
                <MaterialCommunityIcons
                  name="signature"
                  size={24}
                  color="black"
                />
                <Text className="mx-2">Signature List</Text>
              </TouchableOpacity>
            </View>
          </View>
        */}
      </ScrollView>
    </SafeAreaView>
  );
}

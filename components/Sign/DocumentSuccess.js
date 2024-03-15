import { View, Text, StatusBar, Alert } from "react-native";
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

export default function DocumentSuccess({ route, navigation }) {
  const animation = useRef(null);
  const { editedDocPath } = route.params;
  const { bottomSheetChooseDocument } = useContext(Context);

  console.log("editedDocPath:", editedDocPath);

  async function openShareOptions() {
    await shareAsync(editedDocPath, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  }

  const createTwoButtonAlert = () =>
    Alert.alert("Alert Title", "My Alert Msg", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

  async function emailDocument() {
    try {
      await MailComposer.composeAsync({ body: "Here we go" });
    } catch (err) {
      console.log(err);
    }
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
            onPress={openShareOptions}
            className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400"
          >
            <FontAwesome6 name="copy" size={24} color="black" />
            <Text className="mx-2">Save a Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center m-3 p-3 border-b-[0.5px] border-gray-400">
            <FontAwesome6 name="share-square" size={24} color="black" />
            <Text className="mx-2">Share through...</Text>
          </TouchableOpacity>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

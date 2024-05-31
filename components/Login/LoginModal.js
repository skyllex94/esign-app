import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import AppleAuth from "./AppleAuth";
import { Ionicons } from "@expo/vector-icons";
import GoogleAuth from "./GoogleAuth";

export default function LoginModal({ navigation }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <TouchableOpacity
        className="absolute top-12 left-3 p-2"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>

      <Image
        source={require("../../assets/icon.jpg")}
        className="h-24 w-24 rounded-3xl"
      />

      <Text className="font-extralight text-[16px] mt-10 mb-4">
        Create an account or Sign in
      </Text>
      <View className="sign-in-options">
        <AppleAuth navigation={navigation} />
        <GoogleAuth navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

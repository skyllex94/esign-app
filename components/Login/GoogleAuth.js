import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function GoogleAuth({ navigation }) {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  function configureGoogleSignIn() {
    // Google Drive Configurations for proper scopes and connection
    GoogleSignin.configure({
      offlineAccess: true,
      iosClientId: process.env.EXPO_PUBLIC_GDRIVE_IOS_CLIENTID,
      webClientId: process.env.EXPO_PUBLIC_GDRIVE_WEB_CLIENTID,
    });
  }

  async function googleSignIn() {
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();
    // console.log("userInfo:", userInfo);
    const token = await GoogleSignin.getTokens();
    navigation.goBack();
  }

  return (
    <TouchableOpacity
      onPress={googleSignIn}
      className="flex-row bg-white gap-x-1 items-center justify-center w-[250px] h-12 rounded-lg"
    >
      <AntDesign name="google" size={20} color="black" />
      <Text className="font-semibold text-lg">Sign in with Google</Text>
    </TouchableOpacity>
  );
}

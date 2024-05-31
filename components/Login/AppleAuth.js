import { Ionicons } from "@expo/vector-icons";
import * as AppleAuthentication from "expo-apple-authentication";
import { View, TouchableOpacity, Text } from "react-native";
import { showMessage } from "react-native-flash-message";

export default function AppleAuth({ navigation }) {
  async function appleSignIn() {
    isAppleAuthAvailable();

    try {
      const credentials = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // console.log("credentials:", credentials);

      navigation.goBack();
    } catch (err) {
      showMessage({
        duration: 3000,
        type: "danger",
        message: "Error occured while signing",
        description: err.toString(),
      });
    }
  }

  // Check if Apple Auth in available
  function isAppleAuthAvailable() {
    if (AppleAuthentication.isAvailableAsync() === false) {
      showMessage({
        duration: 3000,
        type: "danger",
        message: "Error occured while signing",
        description: "Your system does not support Apple login process",
      });
      return;
    }
  }

  return (
    <View>
      <View className="items-center justify-center mb-2">
        <TouchableOpacity
          onPress={appleSignIn}
          className="flex-row bg-white gap-x-1 items-center justify-center w-[250px] h-12 rounded-lg"
        >
          <Ionicons name="logo-apple" size={24} color="black" />
          <Text className="font-semibold text-lg mt-1">Sign in with Apple</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

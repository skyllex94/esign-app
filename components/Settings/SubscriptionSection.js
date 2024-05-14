import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useRevenueCat from "../../hooks/useRevenueCat";
import Purchases from "react-native-purchases";
import { showMessage } from "react-native-flash-message";
import { openRequestReviewModal } from "../functions/Global";

export default function SubscriptionSection({ navigation }) {
  const { isProMember } = useRevenueCat();

  async function handleRestorePurchase() {
    showMessage({
      message: "Looking to restore a purchase",
      duration: 2000,
      type: "info",
    });
    const purchaserInfo = await Purchases.restorePurchases();

    if (purchaserInfo?.activeSubscriptions.length > 0) {
      Alert.alert("Success", "Your purchase has been restored");
    } else Alert.alert("Failure", "There are no purchases to restore");
  }

  return (
    <View className="items-center mx-3 gap-y-2">
      {!isProMember && (
        <LinearGradient
          className="flex-row bg-white items-center justify-between py-3 w-full rounded-lg"
          colors={["#2485a6", "#2c67f2"]}
          start={[0, 0]}
          end={[1, 1]}
          location={[0.25, 0.4, 1]}
        >
          <View className="flex-1 items-start ml-5 gap-y-1">
            <Text className="text-lg font-semibold text-[20px] text-white">
              Upgrade to Premium
            </Text>
            <Text className="text-slate-200">Unlock 10+ Premium Features</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Paywall")}
            className="bg-white rounded-full mr-4"
          >
            <Text className="p-3 font-semibold">Upgrade</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      <TouchableOpacity
        onPress={handleRestorePurchase}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Restore Purchase</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={openRequestReviewModal}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Rate the App</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>
    </View>
  );
}

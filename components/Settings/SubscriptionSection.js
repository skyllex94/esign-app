import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
// import useRevenueCat from "../../hooks/useRevenueCat";
// import { openPurchaseModal } from "../Utils/Funcs";
import { LinearGradient } from "expo-linear-gradient";

export default function SubscriptionSection({ navigation }) {
  // const { isProMember } = useRevenueCat();

  return (
    <View className="items-center mx-3 gap-y-2">
      <TouchableOpacity
      // onPress={!isProMember && (() => openPurchaseModal(navigation))}
      // className={`${
      //   isProMember && "hidden"
      // }  bg-[#101C43]  justify-center my-5 h-12 w-[95%] rounded-lg`}
      >
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

          <TouchableOpacity className="bg-white rounded-full mr-4">
            <Text className="p-3 font-semibold">Upgrade</Text>
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center justify-between bg-white w-full rounded-lg p-3">
        <Text className="text-slate-800">Restore Purchase</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center justify-between bg-white w-full rounded-lg p-3">
        <Text className="text-slate-800">Rate the App</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>
    </View>
  );
}

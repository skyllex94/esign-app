import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { appVersion } from "../../constants/Utils";

export default function AboutSection() {
  return (
    <View className="mx-3 gap-y-2 pt-4">
      <Text className="text-black text-[15px] font-thin ml-3">About</Text>

      <TouchableOpacity className="flex-row items-center justify-between bg-white w-full rounded-lg p-3">
        <Text className="text-slate-800">Tell Friends</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center justify-between bg-white w-full rounded-lg p-3">
        <Text className="text-slate-800">App Version</Text>
        <Text className="text-slate-800">{appVersion}</Text>
      </TouchableOpacity>
    </View>
  );
}

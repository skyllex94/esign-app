import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { tellFriends } from "../functions/Global";

export default function AboutSection() {
  return (
    <View className="mx-3 gap-y-2 pt-4">
      <Text className="text-black text-[15px] font-thin ml-3">About</Text>

      <TouchableOpacity
        onPress={tellFriends}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Tell Friends</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <View className="flex-row items-center justify-between bg-white w-full rounded-lg p-3">
        <Text className="text-slate-800">App Version</Text>
        <Text className="text-slate-800">1.1.1</Text>
      </View>
    </View>
  );
}

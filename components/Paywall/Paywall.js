import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function Paywall({ route, navigation }) {
  const { editingPalette } = route.params;
  console.log("editingPalette:", editingPalette);

  return (
    <View className="flex-1 bg-[#7875f1]">
      <View className="items-center">
        <Image
          className="h-72 w-full rounded-bl-full rounded-b-[180px]"
          resizeMode="center"
          source={require("../../assets/img/paywall_image.webp")}
        />

        <View className="w-[80px] absolute shadow top-60 bg-white rounded-full p-4">
          <MaterialIcons name="workspace-premium" size={48} color="black" />
        </View>

        <View className="mb-10" />

        <Text className="text-white font-light text-[20px]">
          Upgrade to Premium
        </Text>
      </View>

      <View className="premium-features mt-6">
        <View className="flex-row gap-x-3 m-3 ">
          <MaterialIcons name="workspace-premium" size={48} color="white" />
          <View className="flex-1 gap-y-1">
            <Text className="text-white text-[16px] font-semibold">
              Get All Editing Tools
            </Text>
            <Text className="text-white text-[14px] ">
              Unlock all editing tools such as inserting: Date, Initials,
              Images, Custom Text, Checkboxes.
            </Text>
          </View>
        </View>

        <View className="flex-row gap-x-3 m-3 ">
          <MaterialIcons name="workspace-premium" size={48} color="white" />
          <View className="flex-1 gap-y-1">
            <Text className="text-white text-[16px] font-semibold">
              Get All Editing Tools
            </Text>
            <Text className="text-white text-[14px] ">
              Unlock all editing tools such as inserting: Date, Initials,
              Images, Custom Text, Checkboxes.
            </Text>
          </View>
        </View>

        <View className="flex-row gap-x-3 m-3 ">
          <MaterialIcons name="workspace-premium" size={48} color="white" />
          <View className="flex-1 gap-y-1">
            <Text className="text-white text-[16px] font-semibold">
              Get All Editing Tools
            </Text>
            <Text className="text-white text-[14px] ">
              Unlock all editing tools such as inserting: Date, Initials,
              Images, Custom Text, Checkboxes.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

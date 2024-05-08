import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";

export default function OurAppsSection() {
  return (
    <View className="mx-3 gap-y-2 pt-4">
      <Text className="text-black text-[15px] font-thin ml-3">Our Apps</Text>

      <ScrollView
        className="bg-white mt-5 rounded-lg w-full"
        alwaysBounceHorizontal
        alwaysBounceVertical={false}
      >
        <View className="flex-row gap-x-4 justify-start h-28">
          <TouchableOpacity
            onPress={() => Linking.openURL("https://micronvpn.netlify.app")}
            className="justify-center items-start "
          >
            <View className="items-center ml-3">
              <View className="flex-row">
                <Image
                  className="h-16 w-16 rounded-xl"
                  source={require("../../assets/img/vpn_icon.png")}
                />
              </View>
              <Text className="text-slate-600 mt-1">MicronVPN</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://apps.apple.com/us/app/water-eject-airpods-waterdrop/id6449911513?platform=iphone"
              )
            }
            className="justify-center items-start"
          >
            <View className="items-center">
              <View className="flex-row">
                <Image
                  className="h-16 w-16 rounded-xl border-[0.5px] border-slate-300"
                  source={require("../../assets/img/waterdrop_icon.png")}
                />
              </View>
              <Text className="text-slate-600 mt-1">WaterDrop</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

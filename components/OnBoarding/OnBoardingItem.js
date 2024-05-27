import {
  View,
  Text,
  Image,
  useWindowDimensions,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";

import { TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function OnBoardingItem({ item, navigation }) {
  const { width } = useWindowDimensions();

  async function sendToMainScreen() {
    await AsyncStorage.setItem("@isAppFirstLaunched", "false");
    navigation.replace("Main");
  }

  return (
    <SafeAreaView style={[{ width }]}>
      {item.id === 6 ? (
        <View>
          <TouchableOpacity
            onPress={sendToMainScreen}
            className={`close-button z-10 absolute top-4 right-4 rounded-full p-3`}
          >
            <AntDesign name="close" size={20} color="#94a3b8" />
          </TouchableOpacity>

          <View className="items-center justify-center">
            <Image
              source={item.image}
              className="items-center justify-center"
              style={[{ width: width, height: 450 }]}
            />
          </View>

          <View>
            <Text
              className={`font-bold text-center text-[28px] px-6 mb-4 text-slate-600`}
            >
              {item.title}
            </Text>

            <View className="premium-features">
              <View className="flex-row items-center gap-x-5 m-1">
                <FontAwesome6 name="toolbox" size={24} color="#334155" />
                <View className="flex-1 gap-y-1">
                  <Text className="text-slate-600 text-[15px] font-semibold">
                    All Editing Tools
                  </Text>
                  <Text className="text-slate-500 font-light">
                    Unlock all editing tools: Dates, Initials, Images, Custom
                    Text, Checks and more to come.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-x-5 m-1">
                <MaterialCommunityIcons
                  name="file-document-edit"
                  size={24}
                  color="#334155"
                />
                <View className="flex-1 gap-y-1">
                  <Text className="text-slate-600 text-[15px] font-semibold">
                    15+ Document Templates
                  </Text>
                  <Text className="text-slate-500 font-light">
                    Try different templates for direct editing with more being
                    added on a regular basis.
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-x-5 m-1">
                <MaterialIcons
                  name="camera-enhance"
                  size={24}
                  color="#334155"
                />
                <View className="flex-1 gap-y-1">
                  <Text className="text-slate-600 text-[15px] font-semibold">
                    Camera Scanning
                  </Text>
                  <Text className="text-slate-500 font-light">
                    Get included camera scanning and organizing your documents
                    in a safe environment.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View className="items-center justify-center">
            <Image
              source={item.image}
              className="items-center justify-center"
              style={[{ width: "95%", height: 450 }]}
            />
          </View>

          <View>
            <Text
              className={`font-bold text-center text-[28px] px-6 mb-3 text-slate-600`}
            >
              {item.title}
            </Text>
            <Text className="font-light text-center px-8 text-slate-500">
              {item.description}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

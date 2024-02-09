import * as React from "react";
import { Text, SafeAreaView, StatusBar } from "react-native";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      <Text className="text-center font-bold text-2xl">SimpleSign</Text>
      <Text className="text-center mt-5">
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

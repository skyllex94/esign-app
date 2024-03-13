import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DocumentPreview({ route }) {
  const { doc } = route.params;
  console.log("doc:", doc);

  return (
    <SafeAreaView>
      <Text>DocumentPreview</Text>
    </SafeAreaView>
  );
}

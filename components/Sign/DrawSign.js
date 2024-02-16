import { View, Text, SafeAreaView } from "react-native";
import React from "react";
// Signature Imports
import SignatureCapture from "react-native-signature-capture";

export default function DrawSign() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <SignatureCapture
        className="flex-1"
        showBorder={true}
        viewMode={"portrait"}
      />
    </SafeAreaView>
  );
}

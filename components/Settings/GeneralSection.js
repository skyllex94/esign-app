import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { reportBug, sendFeedback } from "../functions/Global";
import PromoCodeModal from "./PromoCodeModal";

export default function GeneralSection({ navigation }) {
  const [openPromoModal, setOpenPromoModal] = useState(false);

  return (
    <View className="mx-3 gap-y-2 pt-4">
      <Text className="text-black text-[15px] font-thin ml-3">General</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("PrivacyPolicy")}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Privacy Policy</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Terms")}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Terms & Conditions</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={sendFeedback}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Share Feedback</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setOpenPromoModal(true)}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Enter Promo Code</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={reportBug}
        className="flex-row items-center justify-between bg-white w-full rounded-lg p-3"
      >
        <Text className="text-slate-800">Report a Bug</Text>
        <AntDesign name="right" size={14} color="black" />
      </TouchableOpacity>

      {openPromoModal && (
        <PromoCodeModal
          openPromoModal={openPromoModal}
          setOpenPromoModal={setOpenPromoModal}
        />
      )}
    </View>
  );
}

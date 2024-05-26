import { useEffect, useRef, useState } from "react";
import { View, Text, Modal, TouchableOpacity, TextInput } from "react-native";
import { actionButton } from "../../constants/UI";

export default function PromoCodeModal({ openPromoModal, setOpenPromoModal }) {
  const promoRef = useRef();
  const [promoCode, setPromoCode] = useState("");

  useEffect(() => {
    promoRef.current.focus();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={openPromoModal}
      onRequestClose={() => setOpenPromoModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => setOpenPromoModal(false)}
      />

      <View className="flex-1 justify-center items-center">
        <View className="m-8 bg-white rounded-lg p-5 shadow">
          <View className="flex-row items-center justify-between my-2 w-full">
            <TextInput
              ref={promoRef}
              placeholder="Enter Promo Code"
              onChangeText={(text) => setPromoCode(text)}
              className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
            />
          </View>

          <View className="flex-row items-center justify-between my-2 w-full">
            <TouchableOpacity
              className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
            >
              <Text className="text-[16px] text-white">Use Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setOpenPromoModal(false)}
              className={`rounded-lg bg-slate-200 py-3 px-6`}
            >
              <Text className="text-[16px]">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="flex-1"
        onPress={() => setOpenPromoModal(false)}
      />
    </Modal>
  );
}

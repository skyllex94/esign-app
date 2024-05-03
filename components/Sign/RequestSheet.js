import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import EmailRequestModal from "./EmailRequestModal";

export default function RequestSheet({
  requestSheet,
  preopeningGoogleDriveCheckups,
  signOut,
}) {
  const snapPoints = useMemo(() => ["33%"], []);
  const [showEmailRequestModal, setShowEmailRequestModal] = useState(false);

  return (
    <BottomSheetModal
      ref={requestSheet}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={2}
          disappearsOnIndex={-1}
          enableTouchThrough={true}
        />
      )}
      enableOverDrag={true}
      enablePanDownToClose={true}
      animateOnMount={true}
    >
      <View className="flex-row items-center justify-between px-3 pb-6 z-[10]">
        <Text className="text-lg font-semibold">Request Document</Text>

        <TouchableOpacity
          className="bg-gray-200 rounded-full p-2"
          onPress={() => requestSheet.current.close()}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="bottomsheet mx-4 gap-y-2">
        <Text className="text-gray-500 py-2">Request By:</Text>

        <TouchableOpacity
          onPress={() => setShowEmailRequestModal(true)}
          className="flex-row h-12 w-full justify-start bg-gray-200 rounded-lg px-10"
        >
          <View className="flex-row items-center gap-x-2">
            <MaterialCommunityIcons
              name="folder-account"
              size={28}
              color="black"
            />
            <Text className="font-semibold">Email</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row gap-x-2">
          <TouchableOpacity
            onPress={preopeningGoogleDriveCheckups}
            className="flex-row h-12 w-[70%] justify-start bg-gray-200 rounded-lg px-10"
          >
            <View className="flex-row items-center gap-x-2">
              <MaterialCommunityIcons
                name="folder-google-drive"
                size={28}
                color="black"
              />
              <Text className="font-semibold">Google Drive</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signOut}
            className="flex-1 items-center justify-center bg-gray-200 rounded-lg p-2"
          >
            <View className="flex-row items-center gap-x-2">
              <Text className="font-semibold">Sign out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {showEmailRequestModal && (
          <EmailRequestModal
            showEmailRequestModal={showEmailRequestModal}
            setShowEmailRequestModal={setShowEmailRequestModal}
          />
        )}
      </View>
    </BottomSheetModal>
  );
}

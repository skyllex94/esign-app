import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useMemo, useState } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import { Context } from "../contexts/Global";

export default function LibrarySheet({ navigation }) {
  const snapPoints = useMemo(() => ["33%"], []);
  const [showEmailRequestModal, setShowEmailRequestModal] = useState(false);

  const { librarySheet } = useContext(Context);

  return (
    <BottomSheetModal
      ref={librarySheet}
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
        <Text className="text-lg font-semibold">Local Secured Files</Text>

        <TouchableOpacity
          className="bg-gray-200 rounded-full p-2"
          onPress={() => librarySheet.current.close()}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="bottomsheet mx-4 gap-y-2">
        <Text className="text-gray-500 py-2">Document Type:</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("DrawSign")}
          className="flex-row h-12 w-full justify-start bg-gray-200 rounded-lg px-10"
        >
          <View className="flex-row items-center gap-x-2">
            <MaterialCommunityIcons
              name="folder-star"
              size={28}
              color="black"
            />
            <Text className="font-semibold">Signatures Library</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Initials")}
          className="flex-row h-12 w-full justify-start bg-gray-200 rounded-lg px-10"
        >
          <View className="flex-row items-center gap-x-2">
            <MaterialCommunityIcons
              name="folder-star"
              size={28}
              color="black"
            />
            <Text className="font-semibold">Initials Library</Text>
          </View>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

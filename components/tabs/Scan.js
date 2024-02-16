import React, { useCallback, useContext, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from "react-native";
// UI Elements
import { AntDesign } from "@expo/vector-icons";
// Dependencies
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { Context } from "../contexts/Global";

export default function ScanScreen() {
  const { bottomSheetModalRef, handlePresentModalPress } = useContext(Context);
  const snapPoints = useMemo(() => ["50%"], []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <SafeAreaView className="flex-1 p-5 bg-white">
      <Button title="Open Sheet" onPress={handlePresentModalPress} />
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
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
        <View className="flex-row items-center justify-between px-3 pb-6">
          <Text className="text-lg font-semibold">E-Sign Document</Text>
          <TouchableOpacity
            className="bg-gray-200 rounded-full p-2"
            onPress={() => bottomSheetModalRef.current.close()}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row px-3 h-16">
          <TouchableOpacity className="flex-1 bg-gray-200 rounded-md mr-3 p-2">
            <Text>Draw</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-200 rounded-md p-2">
            <Text>Import Photo</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
}

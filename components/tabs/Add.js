import React, { useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  SafeAreaView,
} from "react-native";
// UI Elements
import { AntDesign } from "@expo/vector-icons";
// Dependencies
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function AddScreen() {
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ["40%", "70%"], []);

  // Callbacks
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 p-5, bg-white">
        <Button
          title="Open Sheet"
          onPress={() => bottomSheetRef.current.expand()}
        />
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enableOverDrag={true}
          enablePanDownToClose={true}
          animateOnMount={true}
        >
          <View className="flex-1 items-between">
            <Text>Awesome 🎉</Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current.close()}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

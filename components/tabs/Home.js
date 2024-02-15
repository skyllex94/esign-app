import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
// Bottom Sheet Imports
import React, { useContext, useMemo } from "react";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Context } from "../contexts/Global";

export default function HomeScreen() {
  const { bottomSheetModalRef, handlePresentModalPress } = useContext(Context);
  const snapPoints = useMemo(() => ["50%"], []);

  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      <GestureHandlerRootView className="flex-1">
        <View className="flex-1">
          <StatusBar style="auto" />
          <Text className="text-center font-bold text-2xl">SimpleSign</Text>
          <Text className="text-center mt-5">
            Open up App.js to start working on your app!
          </Text>
        </View>

        <BottomSheet
          ref={bottomSheetModalRef}
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
        </BottomSheet>

        <View className="flex-row justify-center mb-4 z-5">
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className="flex-row items-center bg-[#7851A9] p-3 rounded-lg"
          >
            <AntDesign name="plus" size={24} color="white" />
            <Text className="text-white pl-2">E-Sign Document</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

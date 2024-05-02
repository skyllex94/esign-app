import { View, Text, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function BottomSheetModalComponent({
  navigation,
  openDocument,
  bottomSheetChooseDocument,
  preopeningGoogleDriveCheckups,
  signOut,
  pickImageAsync,
}) {
  const snapPoints = useMemo(() => ["50%"], []);

  return (
    <BottomSheetModal
      ref={bottomSheetChooseDocument}
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
        <Text className="text-lg font-semibold">Open a Document</Text>

        <TouchableOpacity
          className="bg-gray-200 rounded-full p-2"
          onPress={() => bottomSheetChooseDocument.current.close()}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View className="bottomsheet mx-4 gap-y-2">
        <Text className="text-gray-500 py-2">Application</Text>

        <TouchableOpacity
          onPress={() => openDocument(navigation, bottomSheetChooseDocument)}
          className="flex-row h-12 w-full justify-start bg-gray-200 rounded-lg px-10"
        >
          <View className="flex-row items-center gap-x-2">
            <MaterialCommunityIcons name="folder" size={28} color="black" />
            <Text className="font-semibold">Files</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickImageAsync}
          className="flex-row h-12 w-full justify-start bg-gray-200 rounded-lg px-10"
        >
          <View className="flex-row items-center gap-x-2">
            <MaterialCommunityIcons
              name="folder-image"
              size={28}
              color="black"
            />

            <Text className="font-semibold">Photos</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            bottomSheetChooseDocument.current.close();
            navigation.navigate("ChooseScanFile", {
              bottomSheetChooseDocument,
            });
          }}
          className="flex-row h-12 w-full justify-start bg-gray-200 rounded-lg px-10"
        >
          <View className="flex-row items-center gap-x-2">
            <MaterialCommunityIcons
              name="folder-table"
              size={28}
              color="black"
            />
            <Text className="font-semibold">Scanned</Text>
          </View>
        </TouchableOpacity>

        <Text className="text-gray-500 py-2">Cloud Storage</Text>

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
      </View>
    </BottomSheetModal>
  );
}

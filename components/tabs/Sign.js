import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
// Bottom Sheet Imports
import React, { useCallback, useContext, useMemo, useRef } from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// Stack Navigation
import { createStackNavigator } from "@react-navigation/stack";
import DrawSignCapture from "../Sign/DrawSignCapture";
import DocumentEditor from "../Sign/DocumentEditor";
// Other Dependency Imports
import * as DocumentPicker from "expo-document-picker";
import { Context } from "../contexts/Global";
import DragSignature from "../Sign/DragSignature";

const Stack = createStackNavigator();

export default function SignScreen() {
  return (
    <Stack.Navigator
      initialRouteName="SignBottomSheet"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignBottomSheet" component={SignBottomSheet} />
      <Stack.Screen
        name="DrawSign"
        component={DrawSignCapture}
        options={{ presentation: "card" }}
      />
      <Stack.Screen
        name="DocumentEditor"
        component={DocumentEditor}
        options={{ presentation: "card" }}
      />
    </Stack.Navigator>
  );
}

function SignBottomSheet({ navigation }) {
  const { bottomSheetChooseDocument } = useContext(Context);
  const snapPoints = useMemo(() => ["50%"], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetChooseDocument.current?.present();
  }, []);

  function openDrawSign() {
    bottomSheetChooseDocument.current.close();
    navigation.navigate("DrawSign");
  }

  async function openSelectDocument() {
    const pickedFile = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true, // enabled to be found by FileSystem
    });

    if (pickedFile.canceled === true) return;

    console.log(pickedFile);

    bottomSheetChooseDocument.current.close();
    navigation.navigate("DocumentEditor", { pickedFile });
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FFFFFF]">
      <View className="flex-1">
        <StatusBar style="auto" />
        <Text className="text-center font-bold text-2xl">SimpleSign</Text>
        <Text className="text-center mt-5">
          Open up App.js to start working on your app!
        </Text>
      </View>

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
          <Text className="text-lg font-semibold">E-Sign Document</Text>
          <TouchableOpacity
            className="bg-gray-200 rounded-full p-2"
            onPress={() => bottomSheetChooseDocument.current.close()}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="flex-row px-3 h-16">
          <TouchableOpacity
            onPress={openDrawSign}
            className="flex-1 bg-gray-200 rounded-md mr-3 p-2"
          >
            <Text>Draw</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-200 rounded-md p-2">
            <Text>Import Photo</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between px-3 py-6 z-[10]">
          <Text className="text-lg font-semibold">Open a Document</Text>
        </View>

        <View className="flex-row px-3 h-16">
          <TouchableOpacity
            onPress={openSelectDocument}
            className="flex-1 bg-gray-200 rounded-md mr-3 p-2"
          >
            <Text>Files</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-200 rounded-md p-2">
            <Text>Google Drive</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>

      <View className="flex-row justify-center mb-4 z-5">
        <TouchableOpacity
          onPress={handlePresentModalPress}
          className="flex-row items-center bg-[#7851A9] p-3 rounded-lg"
        >
          <AntDesign name="plus" size={24} color="white" />
          <Text className="text-white pl-2">E-Sign Document</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

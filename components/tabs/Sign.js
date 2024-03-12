import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
// Bottom Sheet Imports
import React, { useCallback, useContext, useMemo } from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// Stack Navigation
import { createStackNavigator } from "@react-navigation/stack";
import DrawSignCapture from "../Sign/DrawSignCapture";
import DocumentEditor from "../Sign/DocumentEditor";
// Other Dependency Imports
import * as DocumentPicker from "expo-document-picker";
import { Context } from "../contexts/Global";
// UI Imports
import { actionButton } from "../../constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import DocumentDetails from "../Sign/DocumentDetails";
// import { SearchBar } from "react-native-elements";

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
      <Stack.Screen
        name="DocumentDetails"
        component={DocumentDetails}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function SignBottomSheet({ navigation }) {
  const { completedDocList, bottomSheetChooseDocument } = useContext(Context);
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
    const pickedDocument = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true, // enabled to be found by FileSystem
    });

    if (pickedDocument.canceled === true) return;

    bottomSheetChooseDocument.current.close();
    navigation.navigate("DocumentEditor", { pickedDocument });
  }

  // For SaveAverView bg-slate-150
  return (
    <SafeAreaView className="flex-1 mx-3">
      <StatusBar style="auto" />
      <Text className="text-center font-bold text-2xl mb-4">SimpleSign</Text>
      <View className="flex-1 gap-2">
        <View></View>

        <View className="flex-row gap-2 mb-4 rounded-lg justify-center">
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`flex-row items-center bg-[${actionButton}] p-3 rounded-lg`}
          >
            <AntDesign name="plus" size={24} color="white" />
            <Text className="text-white pl-2">Sign Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`flex-row items-center bg-slate-300 p-3 rounded-lg`}
          >
            <AntDesign name="plus" size={24} color="white" />
            <Text className="text-white pl-2">Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`flex-row items-center bg-slate-300 p-3 rounded-lg`}
          >
            <AntDesign name="plus" size={24} color="white" />
            <Text className="text-white pl-2">E-Sign</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-start">
          <Text className="font-bold text-gray-700 text-[16px] mb-3">
            Recent Activity
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="bg-white w-full"
          >
            {completedDocList.map((doc, idx) => (
              <View
                key={idx}
                className="flex-row items-center py-2 border-b-[0.5px] border-slate-300"
              >
                <View className="m-3">
                  <AntDesign name="checkcircle" size={24} color="#99cc33" />
                </View>

                <View className="flex-1 items-start gap-1 my-1">
                  <Text className="text-gray-800">{doc.name}</Text>

                  <View>
                    <Text className="text-gray-400">Signed by you</Text>

                    <Text className="text-gray-400">
                      {new Date(doc.created * 1000).toLocaleDateString(
                        "en-us",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}{" "}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("DocumentDetails", { doc })
                  }
                  className="mx-4"
                >
                  <Feather name="more-horizontal" size={24} color="#b7b7b7" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
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
        <View className="bottomSheet flex-row items-center justify-between px-3 pb-6 z-[10]">
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
    </SafeAreaView>
  );
}

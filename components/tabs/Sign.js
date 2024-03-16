import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
// Bottom Sheet Imports
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
// Stack Navigation
import { createStackNavigator } from "@react-navigation/stack";
import DrawSignCapture from "../Sign/DrawSign";
import DocumentEditor from "../Sign/DocumentEditor";
// Other Dependency Import
import { Context } from "../contexts/Global";
import filter from "lodash.filter";
// UI Imports
import { actionButton } from "../../constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import DocumentDetails from "../Sign/DocumentDetails";
import { SearchBar } from "react-native-elements";
import DocumentPreview from "../Sign/DocumentPreview";
import DocumentSuccess from "../Sign/DocumentSuccess";
import { openDocument } from "../functions/Global";

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
      <Stack.Screen
        name="DocumentPreview"
        component={DocumentPreview}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="DocumentSuccess"
        component={DocumentSuccess}
        options={{ presentation: "card" }}
      />
    </Stack.Navigator>
  );
}

function SignBottomSheet({ navigation }) {
  const { docList, signatureList, bottomSheetChooseDocument } =
    useContext(Context);
  const snapPoints = useMemo(() => ["50%"], []);
  const [search, setSearch] = useState(null);
  const [filteredDocs, setFilteredDocs] = useState(docList);

  useEffect(() => {
    setFilteredDocs(docList);
  }, []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetChooseDocument.current?.present();
  }, []);

  function openDrawSign() {
    bottomSheetChooseDocument.current.close();
    navigation.navigate("DrawSign");
  }

  function previewDocument(doc) {
    navigation.navigate("DocumentPreview", { doc });
  }

  function handleSearch(query) {
    setSearch(query);
    const formattedQuery = query.toLowerCase();

    const filteredData = filter(docList, (doc) => {
      return contains(doc, formattedQuery);
    });

    setFilteredDocs(() => filteredData);
  }

  const contains = ({ name }, query) => {
    if (name.toString().toLowerCase().includes(query)) return true;
    return false;
  };

  // For SafeAreaView
  return (
    <SafeAreaView className="flex-1 bg-slate-150">
      <StatusBar style="auto" />
      <Text className="text-center font-bold text-2xl my-2">SimpleSign</Text>

      <View className="search-bar mx-1">
        <SearchBar
          value={search}
          onChangeText={(text) => handleSearch(text)}
          platform="ios"
          containerStyle={{
            backgroundColor: "transparent",
            alignContent: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
            alignContent: "stretch",
            gap: 0,
            rowGap: 0,
            justifyContent: "space-between",
            margin: 0,
          }}
          placeholder="Search..."
          clearIcon={() => (
            <Ionicons
              onPress={() => setSearch("")}
              name="close"
              size={24}
              color="#7b7d7b"
            />
          )}
          searchIcon={() => (
            <TouchableOpacity>
              <Ionicons name="search" size={24} color="#7b7d7b" />
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="flex-1 gap-y-2 mx-3">
        <View className="flex-1 items-start">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="bg-white w-full rounded-lg"
          >
            {filteredDocs.map((doc, idx) => (
              <View
                key={idx}
                className="flex-row items-center py-2 border-b-[0.5px] border-slate-300"
              >
                <View className="m-3">
                  <AntDesign name="checkcircle" size={24} color="#99cc33" />
                </View>

                <TouchableOpacity
                  onPress={() => previewDocument(doc)}
                  className="flex-1 items-start gap-1 my-1"
                >
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
                </TouchableOpacity>

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

        <View className="flex-row gap-y-2 mb-4 rounded-lg justify-between">
          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`flex-row items-center bg-[${actionButton}] p-3 rounded-lg w-[48%] h-[90px]`}
          >
            <AntDesign name="plus" size={24} color="white" />
            <Text className="text-white pl-2">Sign Document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePresentModalPress}
            className={`flex-row items-center bg-white p-3 rounded-lg w-[48%]`}
          >
            <FontAwesome name="mail-forward" size={24} color="black" />
            <Text className="text-black pl-2">Request Signature</Text>
          </TouchableOpacity>
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
            onPress={() =>
              openDocument(navigation, signatureList, bottomSheetChooseDocument)
            }
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

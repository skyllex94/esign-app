import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  LogBox,
  Image,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { SearchBar } from "react-native-elements";
import { Context } from "../contexts/Global";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  clearSearch,
  getLastFolder,
  handleSearch,
  removeExtension,
  removeLastFolder,
  truncate,
  updateList,
} from "../functions/Global";
import OpenScanner from "../Scan/OpenScanner";
import LottieView from "lottie-react-native";
import { createStackNavigator } from "@react-navigation/stack";
import DocumentScanDetails from "../Scan/DocumentScanDetails";
import DocumentScanPreview from "../Scan/DocumentScanPreview";
import NewFolderModal from "../Scan/NewFolderModal";
import FolderScanDetails from "../Scan/FolderScanDetails";
import ScanBanner from "../Scan/ScanBanner";
import { bgColor } from "../../constants/UI";

const Stack = createStackNavigator();

export default function ScanScreen() {
  return (
    <Stack.Navigator
      initialRouteName={MainNavigatorScreen}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainScan" component={MainNavigatorScreen} />
      <Stack.Screen
        name="DocumentScanDetails"
        component={DocumentScanDetails}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="FolderScanDetails"
        component={FolderScanDetails}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="DocumentScanPreview"
        component={DocumentScanPreview}
        options={{ presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

function MainNavigatorScreen({ navigation }) {
  // Context imports
  const {
    scanList,
    setScanList,
    docList,
    filteredScanList,
    setFilteredScanList,
    loadScannedDocs,
    scanPath,
    setScanPath,
  } = useContext(Context);

  // Searchbar states
  const [search, setSearch] = useState("");

  // UI refs
  const astronautRef = useRef();

  // Ignoring warnings
  LogBox.ignoreLogs(["Sending..."]);

  // New folder state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  // Edit document state
  const [isEditDocument, setIsEditDocument] = useState(false);

  return (
    <SafeAreaView className={`flex-1 gap-y-2 bg-[${bgColor}]`}>
      <View className="search-bar mx-1 my-[-4]">
        <SearchBar
          value={search}
          onChangeText={(text) =>
            handleSearch(text, scanList, setFilteredScanList, setSearch)
          }
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
          clearIcon={
            <Ionicons
              onPress={() =>
                clearSearch(setSearch, setFilteredScanList, scanList)
              }
              name="close"
              size={24}
              color="#7b7d7b"
            />
          }
          searchIcon={
            <TouchableOpacity>
              <Ionicons name="search" size={24} color="#7b7d7b" />
            </TouchableOpacity>
          }
        />
      </View>

      <ScanBanner />

      <View className="flex-1 mx-3">
        <View
          className="file-explorer flex-1 bg-white
         w-[100%] rounded-lg"
        >
          <View className="flex-row items-center justify-start mx-2 mt-3">
            {getLastFolder(scanPath).toString() == "Scanned" ? null : (
              <TouchableOpacity
                onPress={() => {
                  const newPath = removeLastFolder(scanPath);
                  updateList(
                    newPath,
                    setScanPath,
                    setScanList,
                    setFilteredScanList
                  );
                }}
                className="pr-3"
              >
                <Ionicons name="arrow-back-sharp" size={24} color="black" />
              </TouchableOpacity>
            )}
            <Text className="text-[15px] m-1">Scanned Documents</Text>
          </View>

          <View className="flex-1 items-center justify-center">
            <ScrollView
              vertical
              showsVerticalScrollIndicator={false}
              className={`gap-y-2 rounded-lg my-1 w-full`}
            >
              {loadScannedDocs ? (
                filteredScanList.length > 0 ? (
                  filteredScanList.map((doc, idx) =>
                    doc.path.includes(".pdf") ? (
                      <TouchableOpacity
                        onPress={
                          isEditDocument
                            ? () => {
                                setIsEditDocument(false);
                                navigation.navigate("DocumentEditor", {
                                  pickedDocument: doc.path,
                                });
                              }
                            : () =>
                                navigation.navigate("DocumentScanPreview", {
                                  doc,
                                })
                        }
                        className={`flex-row items-center pb-2 bg-white border-b-[0.5px] border-slate-200`}
                        key={idx}
                      >
                        <View className="rounded-lg p-3">
                          <Image
                            className="h-6 w-6"
                            source={require("../../assets/img/doc.png")}
                          />
                        </View>

                        <View className="items-start gap-1 my-1">
                          <Text className="text-gray-800">
                            {truncate(removeExtension(doc.name), 40)}
                          </Text>

                          <View>
                            {/* <Text className="text-gray-400">PDF Document</Text> */}
                            <Text className="text-gray-400">
                              {new Date(doc.created * 1000).toLocaleDateString(
                                "en-us",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("DocumentScanDetails", { doc })
                          }
                          className="absolute right-0 m-2 mr-3"
                        >
                          <Feather
                            name="more-horizontal"
                            size={24}
                            color="#b7b7b7"
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setScanPath(doc.path);
                          updateList(
                            doc.path,
                            setScanPath,
                            setScanList,
                            setFilteredScanList
                          );
                        }}
                        className={`flex-row items-center pb-2 bg-white border-b-[0.5px] border-slate-200`}
                        key={idx}
                      >
                        <View className="rounded-lg p-3">
                          <Image
                            className="h-5 w-6"
                            source={require("../../assets/img/folder.png")}
                          />
                        </View>

                        <View className="items-start gap-1 my-1">
                          <Text className="text-gray-800">
                            {truncate(removeExtension(doc.name), 30)}
                          </Text>

                          <View>
                            {/* <Text className="text-gray-400">Folder</Text> */}
                            <Text className="text-gray-400">
                              {new Date(doc.created * 1000).toLocaleDateString(
                                "en-us",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("FolderScanDetails", { doc })
                          }
                          className="absolute right-0 m-2 mr-3"
                        >
                          <Feather
                            name="more-horizontal"
                            size={24}
                            color="#b7b7b7"
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )
                  )
                ) : (
                  <View className="flex-1 pt-8 items-center justify-center">
                    <LottieView
                      autoPlay
                      speed={0.5}
                      ref={astronautRef}
                      style={{ width: 250, height: 130 }}
                      source={require("../../assets/lottie/scan_astronaut.json")}
                    />
                    <Text className="text-gray-500 mt-2">
                      {scanList.length > 0
                        ? "Nothing Found"
                        : docList.length > 0
                        ? "No Documents Here"
                        : "No Documents Here, Either"}
                    </Text>
                  </View>
                )
              ) : (
                <View className="flex-1 mt-6 items-center justify-center">
                  <ActivityIndicator size={"small"} />
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </View>

      <OpenScanner
        navigation={navigation}
        setShowNewFolderModal={setShowNewFolderModal}
        setIsEditDocument={setIsEditDocument}
      />

      {showNewFolderModal && (
        <NewFolderModal
          scanPath={scanPath}
          setScanPath={setScanPath}
          showNewFolderModal={showNewFolderModal}
          setShowNewFolderModal={setShowNewFolderModal}
        />
      )}
    </SafeAreaView>
  );
}

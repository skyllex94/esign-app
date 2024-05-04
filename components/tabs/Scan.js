import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  LogBox,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { SearchBar } from "react-native-elements";
import { Context } from "../contexts/Global";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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
import { LinearGradient } from "expo-linear-gradient";
import NewFolderModal from "../Scan/NewFolderModal";
import FolderScanDetails from "../Scan/FolderScanDetails";
import { showMessage } from "react-native-flash-message";
import { actionButton } from "../../constants/UI";

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
  // Context
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

  // Edit Document state
  const [isEditDocument, setIsEditDocument] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-150">
      <View className="search-bar mx-1">
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

      <View className="flex-row flex-wrap mx-3 my-1">
        <TouchableOpacity
          onPress={() => setShowNewFolderModal(true)}
          className="w-[49%] h-full mr-[2%]"
        >
          <LinearGradient
            // Button Linear Gradient
            className="h-24 items-center justify-center rounded-lg gap-y-1"
            colors={["#662D8C", "#ED1E79"]}
            start={[0, 0]}
            end={[1, 1]}
            location={[0.25, 0.4, 1]}
          >
            <MaterialCommunityIcons name="folder" size={40} color="white" />
            <Text className="text-white">Create folder</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsEditDocument(true);

            showMessage({
              message: "Choose a document to edit.",
              color: "white",
              backgroundColor: actionButton,
              duration: 1000,
            });
          }}
          className="w-[49%] h-full"
        >
          <LinearGradient
            className="h-24 items-center justify-center  rounded-lg gap-y-1"
            colors={["#FF512F", "#DD2476"]}
            start={[0, 0]}
            end={[1, 1]}
            location={[0.75, 0.2, 0.2]}
          >
            <MaterialCommunityIcons name="file-edit" size={34} color="white" />
            <Text className="text-white">Edit Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {showNewFolderModal && (
        <NewFolderModal
          scanPath={scanPath}
          setScanPath={setScanPath}
          showNewFolderModal={showNewFolderModal}
          setShowNewFolderModal={setShowNewFolderModal}
        />
      )}

      <View className="flex-1 mx-3 my-2">
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

            <Text className="text-[17px] m-1">Scanned Documents</Text>
          </View>

          <View className="flex-1 items-center justify-center">
            <ScrollView
              vertical
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
              className="w-[100%] gap-2 rounded-lg ml-2 my-3"
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
                        className={`h-40 w-[30%] bg-white border-[0.5px] border-gray-300 rounded-lg`}
                        key={idx}
                      >
                        <View className="flex-1 items-center justify-center rounded-lg pt-5">
                          <MaterialIcons
                            name="picture-as-pdf"
                            size={44}
                            color="black"
                          />
                        </View>

                        <View className="flex-2 items-center gap-1 my-1">
                          <Text className="text-gray-800">
                            {truncate(removeExtension(doc.name), 30)}
                          </Text>

                          <View>
                            <Text className="text-gray-400">
                              {new Date(
                                doc.created * 1000
                              ).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("DocumentScanDetails", { doc })
                          }
                          className="absolute right-0 m-2"
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
                        className={`h-40 w-[30%] bg-white border-[0.5px] border-gray-300 rounded-lg`}
                        key={idx}
                      >
                        <View className="flex-1 items-center justify-center rounded-lg pt-5">
                          <MaterialCommunityIcons
                            name="folder"
                            size={50}
                            color="black"
                          />
                        </View>

                        <View className="flex-2 items-center gap-1 my-1">
                          <Text className="text-gray-800">
                            {truncate(removeExtension(doc.name), 30)}
                          </Text>

                          <View>
                            <Text className="text-gray-400">
                              {new Date(
                                doc.created * 1000
                              ).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("FolderScanDetails", { doc })
                          }
                          className="absolute right-0 m-2"
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

        <OpenScanner />
      </View>
    </SafeAreaView>
  );
}

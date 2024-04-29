import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  LogBox,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SearchBar } from "react-native-elements";
import { Context } from "../contexts/Global";
import {
  Entypo,
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  clearSearch,
  getLastFolder,
  getPath,
  goBack,
  handleSearch,
  openFolder,
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
  } = useContext(Context);

  // Searchbar states
  const [search, setSearch] = useState("");

  // UI refs
  const astronautRef = useRef();

  // Ignoring warnings
  LogBox.ignoreLogs(["Sending..."]);

  // New folder state
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [currPath, setCurrPath] = useState(getPath("Scanned"));

  console.log(getLastFolder(currPath));

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

      {/* <View className="mx-3 h-48">
        <Image
          className="rounded-lg"
          source={require("../../assets/img/banner.webp")}
          resizeMode="cover"
          style={{ flex: 1, width: undefined, height: undefined }}
        />
      </View> */}

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
            <Entypo name="folder" size={34} color="white" />
            <Text className="text-white">Create folder</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity className="w-[49%] h-full">
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
          currPath={currPath}
          setCurrPath={setCurrPath}
          showNewFolderModal={showNewFolderModal}
          setShowNewFolderModal={setShowNewFolderModal}
        />
      )}

      <View className="flex-row items-center justify-start m-2">
        {getLastFolder(currPath).toString() == "Scanned" ? null : (
          <TouchableOpacity
            onPress={() => {
              const newPath = removeLastFolder(currPath);
              updateList(
                newPath,
                setCurrPath,
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

      <View className="flex-1 m-2">
        <View className="flex-1 items-start w-[100%] ml-1">
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            className="w-[100%] gap-[2%] rounded-lg"
          >
            {loadScannedDocs ? (
              filteredScanList.length > 0 ? (
                filteredScanList.map((doc, idx) =>
                  doc.path.includes(".pdf") ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DocumentScanPreview", { doc })
                      }
                      className="items-center justify-center h-44 w-[31.3%] bg-white rounded-lg"
                      key={idx}
                    >
                      <View className="flex-1 items-center justify-center rounded-lg pt-1.5">
                        <MaterialIcons
                          name="picture-as-pdf"
                          size={40}
                          color="black"
                        />
                      </View>

                      <View className="flex-1 items-center gap-1 my-1">
                        <Text className="text-gray-800">
                          {truncate(removeExtension(doc.name), 30)}
                        </Text>

                        <View>
                          <Text className="text-gray-400">
                            {new Date(doc.created * 1000).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("DocumentScanDetails", { doc })
                        }
                        className="m-2"
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
                        setCurrPath(doc.path);
                        updateList(
                          doc.path,
                          setCurrPath,
                          setScanList,
                          setFilteredScanList
                        );
                      }}
                      className="items-center justify-center h-44 w-[31.3%] bg-white rounded-lg"
                      key={idx}
                    >
                      <View className="flex-1 items-center justify-center rounded-lg pt-1.5">
                        <Entypo name="folder" size={45} color="black" />
                      </View>

                      <View className="flex-1 items-center gap-1 my-1">
                        <Text className="text-gray-800">
                          {truncate(removeExtension(doc.name), 30)}
                        </Text>

                        <View>
                          <Text className="text-gray-400">
                            {new Date(doc.created * 1000).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("DocumentScanDetails", { doc })
                        }
                        className="m-2"
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

        <OpenScanner path={currPath} setPath={setCurrPath} />
      </View>
    </SafeAreaView>
  );
}

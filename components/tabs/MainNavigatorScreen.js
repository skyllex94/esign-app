import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { SearchBar } from "react-native-elements";
import { Context } from "../contexts/Global";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { clearSearch, handleSearch } from "../functions/Global";
import OpenScanner from "../Scan/OpenScanner";
import LottieView from "lottie-react-native";
import { Animated } from "react-native";

export function MainNavigatorScreen({ navigation }) {
  // Context
  const { scanList, filteredScanList, setFilteredScanList, loadScannedDocs } =
    useContext(Context);

  // Searchbar states
  const [search, setSearch] = useState("");

  // UI refs
  const astronautRef = useRef();

  const av = new Animated.Value(0);
  av.addListener(() => {
    return;
  });

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

      <View className="mx-3 h-48 ">
        <Image
          className="rounded-lg"
          source={require("../../assets/img/banner.webp")}
          resizeMode="cover"
          style={{ flex: 1, width: undefined, height: undefined }}
        />
      </View>

      <View className="flex-1 m-2">
        <View className="flex-1 items-start w-[100%] ml-1">
          <ScrollView
            vertical
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
            className="w-[100%] gap-2"
          >
            {loadScannedDocs ? (
              filteredScanList.length > 0 ? (
                filteredScanList.map((doc, idx) => (
                  <View
                    className="items-center justify-center h-44 w-[31.3%] bg-white rounded-lg"
                    key={idx}
                  >
                    <View
                      onPress={() => {
                        navigation.removeListener;
                        navigation.navigate("DocumentPreview", {
                          doc,
                        });
                      }}
                      className="flex-1 items-center justify-center rounded-lg pt-1.5"
                    >
                      <FontAwesome6 name="file-pdf" size={40} color="black" />

                      {/* <Pdf
                              minScale={1.0}
                              maxScale={1.0}
                              scale={1.0}
                              spacing={0}
                              fitPolicy={0}
                              className="w-28 h-32 rounded-lg"
                              source={{ uri: doc.path, cache: true }}
                            />  */}
                    </View>
                    <TouchableOpacity className="flex-1 items-start gap-1 my-1">
                      <Text className="text-gray-800">{doc.name}</Text>

                      <View>
                        <Text className="text-gray-400">
                          {new Date(doc.created * 1000).toLocaleDateString()}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DocumentScanDetails", { doc })
                      }
                      className="m-4"
                    >
                      <Feather
                        name="more-horizontal"
                        size={24}
                        color="#b7b7b7"
                      />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View className="flex-1 mt-10 items-center justify-center">
                  <LottieView
                    autoPlay
                    speed={0.5}
                    ref={astronautRef}
                    style={{ width: 250, height: 130 }}
                    source={require("../../assets/lottie/scan_astronaut.json")}
                  />
                  {/*  <Text className="text-gray-500">
                          No Documents {scanList.length > 0 ? "Found" : "Yet"}
                        </Text>  */}
                </View>
              )
            ) : (
              <View className="flex-1 mt-6 items-center justify-center">
                <ActivityIndicator size={"small"} />
              </View>
            )}
          </ScrollView>
        </View>

        <OpenScanner />
      </View>
    </SafeAreaView>
  );
}

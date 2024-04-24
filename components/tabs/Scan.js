import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SearchBar } from "react-native-elements";
import { Context } from "../contexts/Global";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import {
  clearSearch,
  handleSearch,
  updateDocuments,
} from "../functions/Global";
import OpenScanner from "../Scan/OpenScanner";

export default function Scan({ navigation }) {
  // Context
  const {
    scanList,
    setScanList,
    filteredScanList,
    setFilteredScanList,
    loadScannedDocs,
    setLoadScannedDocs,
  } = useContext(Context);

  // Searchbar states
  const [search, setSearch] = useState("");

  // Scanner states
  const [openScanner, setOpenScanner] = useState(false);

  useEffect(() => {
    async function loadDocs() {
      await updateDocuments("Scanned", setScanList, setFilteredScanList);
    }

    loadDocs();
    setLoadScannedDocs(true);
  }, [scanList]);

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

      <View className="rounded-lg mx-3 h-48 border-2">
        <Image
          source={require("../../assets/img/banner.webp")}
          resizeMode="cover"
          style={{ flex: 1, width: undefined, height: undefined }}
        />
      </View>

      <View className="flex-1 mx-3 py-3">
        <View className="flex-1 items-start">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="bg-white w-full rounded-lg"
          >
            {loadScannedDocs ? (
              filteredScanList.length > 0 ? (
                filteredScanList.map((doc, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-center py-2 border-b-[0.5px] border-slate-300"
                  >
                    <View className="m-3">
                      <AntDesign name="checkcircle" size={24} color="#99cc33" />
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DocumentPreview", { doc })
                      }
                      className="flex-1 items-start gap-1 my-1"
                    >
                      <Text className="text-gray-800">{doc.name}</Text>

                      <View>
                        <Text className="text-gray-400">Scanned by you</Text>

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
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("DocumentDetails", { doc })
                      }
                      className="mx-4"
                    >
                      <Feather
                        name="more-horizontal"
                        size={24}
                        color="#b7b7b7"
                      />
                    </TouchableOpacity>
                  </View>
                ))
              ) : null
            ) : (
              <View className="flex-1 mt-6 items-center justify-center">
                <ActivityIndicator size={"small"} />
              </View>
            )}
          </ScrollView>
        </View>

        <View className="flex-row items-center justify-center mb-2 rounded-lg ">
          <OpenScanner />
        </View>
      </View>
    </SafeAreaView>
  );
}

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import { SearchBar } from "react-native-elements";
import { Context } from "../contexts/Global";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { clearSearch, handleSearch } from "../functions/Global";
import LottieView from "lottie-react-native";
import { actionButton } from "../../constants/UI";
import OpenScanner from "../Scan/OpenScanner";

export default function Scan() {
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

  // Banner variables
  const scannerAnimation = useRef();

  // Scanner states
  const [openScanner, setOpenScanner] = useState(false);

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
        <LottieView
          autoPlay
          ref={scannerAnimation}
          style={{ width: 200, height: 200 }}
          source={require("../../assets/lottie/scan.json")}
        />
      </View>

      <View className="flex-1 mx-3 py-3">
        <View className="flex-1 items-start">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="bg-white w-full rounded-lg"
          >
            {loadScannedDocs
              ? filteredScanList.length > 0
                ? filteredScanList.map((doc, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center py-2 border-b-[0.5px] border-slate-300"
                    >
                      <View className="m-3">
                        <AntDesign
                          name="checkcircle"
                          size={24}
                          color="#99cc33"
                        />
                      </View>

                      <TouchableOpacity
                        onPress={() => previewDocument(doc)}
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
                : null
              : null}
          </ScrollView>
        </View>

        <View className="flex-row items-center justify-center mb-2 rounded-lg ">
          <TouchableOpacity
            onPress={() => setOpenScanner(true)}
            className={`flex-row items-center justify-center bg-[${actionButton}]
          z-20 w-[50%] h-[75px] rounded-full`}
          >
            <AntDesign name="plus" size={30} color="white" />
            <Text className="pl-2 text-white">Scan Document</Text>
          </TouchableOpacity>

          <View
            className={`absolute items-center justify-center top-[-8] z-10 bg-[#f2f2f2] 
            rounded-full w-[55%] h-[91px]`}
          />
        </View>

        {openScanner && <OpenScanner />}
      </View>
    </SafeAreaView>
  );
}

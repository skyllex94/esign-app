import { View, Text, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Context } from "../contexts/Global";
import {
  getLastFolder,
  removeLastFolder,
  updateList,
} from "../functions/Global";

export default function ChooseScanFile({ navigation, route }) {
  const [isLoaded, setIsLoaded] = useState(true);
  const { bottomSheetChooseDocument } = route.params;

  const { scanList, scanPath, setScanPath, setScanList, setFilteredScanList } =
    useContext(Context);

  async function openFolder(path) {
    setScanPath(path);
    updateList(path, setScanPath, setScanList, setFilteredScanList);
  }

  async function openScannedDocument(path) {
    navigation.navigate("DocumentEditor", { pickedDocument: path });
  }

  return (
    <React.Fragment>
      <View className="flex-row pt-8 pb-4 mx-3 items-center justify-between">
        <View className="flex-row items-center gap-3">
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

          <Text className="text-lg">Scanned Documents</Text>
        </View>

        <View className=" bg-slate-300 items-center justify-center rounded-full w-10 h-10">
          <TouchableOpacity
            onPress={() => {
              bottomSheetChooseDocument.current?.present();
              navigation.goBack();
            }}
          >
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoaded ? (
        <ScrollView>
          {scanList &&
            scanList?.map((doc, idx) => {
              if (doc.path.includes(".pdf")) {
                return (
                  <View key={idx} className="bg-white rounded-lg my-1 mx-3 p-3">
                    <TouchableOpacity
                      onPress={() => openScannedDocument(doc.path)}
                      className="flex-row p-2"
                    >
                      <View className="flex-row items-center">
                        <MaterialCommunityIcons
                          name="file-document-outline"
                          size={24}
                          color="black"
                        />
                        <Text className="ml-3">{doc.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              } else {
                return (
                  <View key={idx} className="bg-white rounded-lg my-1 mx-3 p-3">
                    <TouchableOpacity
                      onPress={() => openFolder(doc.path)}
                      className="flex-row p-2"
                    >
                      <View className="flex-row items-center">
                        <FontAwesome name="folder" size={24} color="black" />
                        <Text className="ml-3">{doc.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          {/*showModal && <LoadingModal />*/}
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </React.Fragment>
  );
}

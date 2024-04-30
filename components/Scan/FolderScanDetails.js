import { View, Text, TouchableOpacity, LogBox } from "react-native";
import React, { useContext, useState } from "react";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { RenameDocumentModal } from "../Sign/RenameDocModal";
import { ScrollView } from "react-native-gesture-handler";
import { deleteDocument, emailDocument, openShareOptions } from "./functions";
import { Context } from "../contexts/Global";
import { byteConverter, getFileName, getFileType } from "../functions/Global";

// Ignoring warnings
LogBox.ignoreLogs(["Sending..."]);

export default function FolderScanDetails({ route, navigation }) {
  const { doc } = route.params;
  const date = doc.created * 1000;

  const [showRenameModal, setShowRenameModal] = useState(false);
  const [docName, setDocName] = useState(doc.name);
  console.log("docName:", docName);
  const [docPath, setDocPath] = useState(doc.path);

  const { scanList, setScanList, setFilteredScanList } = useContext(Context);

  return (
    <View className="mx-3 my-8">
      <View className="flex-row items-center justify-between px-3 pb-6">
        <Text className="text-lg font-semibold">Folder Details</Text>
        <TouchableOpacity
          className="bg-gray-200 rounded-full p-2"
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="close" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView className="h-full">
        <View className="document-info items-center my-3">
          <View className="flex-row bg-white rounded-t-lg items-center justify-between px-3 h-16 w-full border-b-[0.5px] border-gray-400">
            <Text>Name:</Text>
            <Text className="text-gray-500">{docName}</Text>
          </View>

          <View className="flex-row bg-white items-center justify-between px-3 h-16 w-full border-b-[0.5px] border-gray-400">
            <Text>Size:</Text>
            <Text className="text-gray-500">{byteConverter(doc.size)}</Text>
          </View>

          <View className="flex-row bg-white items-center rounded-b-lg justify-between px-3 h-16 w-full">
            <Text>Time Created:</Text>
            <Text className="text-gray-500">
              {new Date(date).toLocaleDateString("en-us", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              at {new Date(date).toLocaleTimeString()}
            </Text>
          </View>
        </View>

        <View className="document-options items-center my-3">
          <View className="border-b-[0.5px] border-gray-300 w-[90%] mb-4 px-6" />

          <TouchableOpacity
            onPress={() =>
              deleteDocument(
                docPath,
                scanList,
                setScanList,
                setFilteredScanList,
                navigation
              )
            }
            className="flex-row bg-white rounded-lg mb-2 items-center px-3 h-16 w-full shadow"
          >
            <MaterialIcons name="delete-outline" size={22} color="red" />
            <Text className="text-red-500 mx-2">Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showRenameModal && (
        <RenameDocumentModal
          docName={docName}
          setDocName={setDocName}
          docPath={docPath}
          setDocPath={setDocPath}
          showRenameModal={showRenameModal}
          setShowRenameModal={setShowRenameModal}
        />
      )}
    </View>
  );
}

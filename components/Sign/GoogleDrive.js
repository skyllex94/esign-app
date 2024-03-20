import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { GDrive } from "@robinbobin/react-native-google-drive-api-wrapper";
import GDriveApi from "@robinbobin/react-native-google-drive-api-wrapper/api/GDriveApi";
import Files from "@robinbobin/react-native-google-drive-api-wrapper/api/files/Files";

export default function GoogleDrive({ navigation, route }) {
  const { files } = route.params;

  console.log("filesINSIDEGD:", files);

  async function getGoogleDriveFile(file) {
    console.log(file.id);

    const getFile = await files.get(file.id);
    console.log("getFile:", getFile);
  }

  return (
    <View>
      <Text className="my-3">HEE-IEE</Text>
      <ScrollView>
        {files &&
          files.files?.map((file, idx) => {
            if (file.mimeType === "application/pdf") {
              console.log(file);
              return (
                <View className="m-2 rounded-lg">
                  <TouchableOpacity
                    onPress={() => getGoogleDriveFile(file)}
                    className="p-2 bg-white "
                  >
                    <Text>{file.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            }
          })}
      </ScrollView>
    </View>
  );
}

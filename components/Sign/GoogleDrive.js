import { View, Text, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { showMessage } from "react-native-flash-message";
// Google Drive imports
import { GDrive } from "@robinbobin/react-native-google-drive-api-wrapper";
import RNFS from "react-native-fs";
import { uint8ToBase64Conversion } from "./functions";
import { Context } from "../contexts/Global";
import { AntDesign } from "@expo/vector-icons";

export default function GoogleDrive({ navigation, route }) {
  const { token } = route.params;
  const [gdriveInstance, setGdriveInstance] = useState();
  const [files, setFiles] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  const { bottomSheetChooseDocument } = useContext(Context);

  useEffect(() => {
    loadGoogleDriveFiles();
    bottomSheetChooseDocument.current.close();
  }, []);

  async function loadGoogleDriveFiles() {
    const gdrive = new GDrive();

    if (!token.accessToken)
      return showMessage({
        duration: 3000,
        title: "Error Ocurred",
        message:
          "There was an error that occured while loading the Google Drive files. Please try again.",
        type: "danger",
      });

    gdrive.accessToken = token.accessToken;

    gdrive.fetchCoercesTypes = true;
    gdrive.fetchRejectsOnHttpErrors = true;
    gdrive.fetchTimeout = 3000;

    // List of documents in Google Drive
    const files = await gdrive.files.list();

    setFiles(files);
    setGdriveInstance(gdrive);
    setIsLoaded(true);
  }

  async function getGoogleDriveFile(file) {
    console.log(file.id);

    try {
    } catch (err) {
      showMessage({
        duration: 3000,
        type: "danger",
        message: "Error while downloading the file",
        description: err.toString(),
      });
    }

    const getFile = await gdriveInstance.files.getBinary(file.id, {
      mimeType: "application/pdf",
    });

    const googleDriveFileBase64 = uint8ToBase64Conversion(getFile);

    const editedDocPath = `${RNFS.DocumentDirectoryPath}/Completed/${file.name}.pdf`;
    console.log("editedDocPath", editedDocPath);

    await RNFS.writeFile(editedDocPath, googleDriveFileBase64, "base64");
  }

  return (
    <View>
      <View className="flex-row mt-8 mb-4 mx-3 items-center justify-between">
        <Text className="text-lg">Google Drive Documents</Text>

        <View className=" bg-slate-300 items-center justify-center rounded-full w-10 h-10">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="close" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {isLoaded ? (
        <ScrollView>
          {files &&
            files.files?.map((file, idx) => {
              if (file.mimeType === "application/pdf") {
                console.log(file);
                return (
                  <View key={idx} className="bg-white rounded-lg my-1 mx-3 p-3">
                    <TouchableOpacity
                      onPress={() => getGoogleDriveFile(file)}
                      className="flex-row p-2"
                    >
                      <Text>{file.name}</Text>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}

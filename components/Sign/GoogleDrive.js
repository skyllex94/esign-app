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
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { updateDocuments } from "../functions/Global";
import LoadingModal from "./LoadingModal";

export default function GoogleDrive({ navigation, route }) {
  const { token } = route.params;
  const [gdriveInstance, setGdriveInstance] = useState();
  const [files, setFiles] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { setDocList, setFilteredDocList, bottomSheetChooseDocument } =
    useContext(Context);

  useEffect(() => {
    loadGoogleDriveFiles();
    bottomSheetChooseDocument.current.close();
  }, []);

  async function loadGoogleDriveFiles() {
    if (!token.accessToken)
      return showMessage({
        duration: 3000,
        title: "Error Ocurred",
        message:
          "There was an error that occured authorizing user credentials.",
        type: "danger",
      });

    try {
      const gdrive = new GDrive();
      gdrive.accessToken = token.accessToken;

      gdrive.fetchCoercesTypes = true;
      gdrive.fetchRejectsOnHttpErrors = true;
      gdrive.fetchTimeout = 3000;

      // List of documents in Google Drive
      const files = await gdrive.files.list();

      setFiles(files);
      setGdriveInstance(gdrive);
      setIsLoaded(true);
    } catch (err) {
      console.log("err:", err.toString().includes("UNAUTHENTICATED"));
      return showMessage({
        duration: 3000,
        title: "Error Ocurred",
        message:
          "There was an error that occured while loading the Google Drive files. Please logout and try again.",
        type: "danger",
      });
    }
  }

  async function getGoogleDriveFile(file) {
    console.log(file.id);
    setShowModal(true);

    try {
      const getFile = await gdriveInstance.files.getBinary(file.id, {
        mimeType: "application/pdf",
      });

      const googleDriveFileBase64 = uint8ToBase64Conversion(getFile);

      // Check if directory path exists
      if (!(await RNFS.exists(`${RNFS.DocumentDirectoryPath}/Imported/`))) {
        RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/Imported/`);
        console.log("Created the path!");
      }

      const gdriveDocPath = `${RNFS.DocumentDirectoryPath}/Imported/${
        file.name.split(".pdf")[0]
      }.pdf`;
      console.log("gdriveDocPath", gdriveDocPath);

      await RNFS.writeFile(gdriveDocPath, googleDriveFileBase64, "base64");
      updateDocuments("Completed", setDocList, setFilteredDocList);

      // Navigate to editor with the document imported from Google Drive
      navigation.navigate("DocumentEditor", { pickedDocument: gdriveDocPath });
    } catch (err) {
      showMessage({
        duration: 4000,
        type: "danger",
        message: "Error while downloading the file. Please try again",
        description: err.toString(),
      });
    }

    setShowModal(false);
  }

  return (
    <React.Fragment>
      <View className="flex-row pt-8 pb-4 mx-3 items-center justify-between">
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
                return (
                  <View key={idx} className="bg-white rounded-lg my-1 mx-3 p-3">
                    <TouchableOpacity
                      onPress={() => getGoogleDriveFile(file)}
                      className="flex-row p-2"
                    >
                      <View className="flex-row items-center">
                        <MaterialCommunityIcons
                          name="file-document-outline"
                          size={24}
                          color="black"
                        />
                        <Text className="ml-3">{file.name}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            })}
          {showModal && <LoadingModal />}
        </ScrollView>
      ) : (
        <ActivityIndicator />
      )}
    </React.Fragment>
  );
}

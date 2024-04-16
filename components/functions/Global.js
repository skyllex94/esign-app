import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function updateDocuments(setDocList, setFilteredDocList) {
  const updateCompleteDocsList = [];

  let docs = await FileSystem.readDirectoryAsync(
    FileSystem.documentDirectory + "Completed"
  );

  for (const doc of docs) {
    const path = FileSystem.documentDirectory + "Completed/" + doc;
    const docInfo = await FileSystem.getInfoAsync(path);

    updateCompleteDocsList.push(
      new Object({
        name: doc,
        path,
        created: docInfo.modificationTime,
        size: docInfo.size,
      })
    );
  }

  setDocList([...updateCompleteDocsList]);
  setFilteredDocList([...updateCompleteDocsList]);
}

export async function getFileInfo(path) {
  const infoObj = await FileSystem.getInfoAsync(path);
  return infoObj;
}

export async function openDocument(navigation, bottomSheetChooseDocument) {
  const pickedDocument = await DocumentPicker.getDocumentAsync({
    type: "application/pdf",
    copyToCacheDirectory: true, // enabled to be found by FileSystem
  });

  if (pickedDocument.canceled === true) return;

  bottomSheetChooseDocument.current.close();

  console.log("pickedDocument:", pickedDocument);
  navigation.navigate("DocumentEditor", {
    pickedDocument: pickedDocument.assets[0].uri,
  });
}

export function getFileType(fileName) {
  const parts = fileName.split(".");
  return parts[parts.length - 1];
}

export function getFileName(file) {
  return file.substring(0, file.lastIndexOf("."));
}

export async function storeData(value) {
  try {
    const gdrive_tkn = JSON.stringify(value);
    await AsyncStorage.setItem("gdrive_tkn", gdrive_tkn);
  } catch (err) {
    console.log("Error while storing data", err);
  }
}

export async function retrieveStoredData(key) {
  console.log("key:", key);
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log("Error while retrieving stored data", err);
  }
}

export async function deleteStoredData(key) {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue) return;
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log("Error while deleting stored data.", err);
  }
}

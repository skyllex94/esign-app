import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

export async function updateDocuments(setDocList) {
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
}

export async function getFileInfo(path) {
  const infoObj = await FileSystem.getInfoAsync(path);
  return infoObj;
}

export async function openDocument(
  navigation,
  signatureList,
  bottomSheetChooseDocument
) {
  if (signatureList.length < 1) {
    navigation.navigate("DrawSign");
    return;
  }

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

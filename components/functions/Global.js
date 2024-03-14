import * as FileSystem from "expo-file-system";

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

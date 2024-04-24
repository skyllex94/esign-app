import * as FileSystem from "expo-file-system";
import RNFS from "react-native-fs";

export async function loadStoredScannedDocs(setScanList) {
  const updatedScanList = [];

  let dir = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
  console.log("dir:", dir);

  dir.forEach((val) => {
    updatedScanList.push(FileSystem.documentDirectory + "/" + val);
  });

  setScanList([...updatedScanList]);
}

export function deleteResidualFiles(arrayOfPaths) {
  arrayOfPaths.map(async (path) => {
    console.log("path", path);

    try {
      const doesFileExists = RNFS.exists(path);
      if (doesFileExists) {
        try {
          await RNFS.unlink(path);
          console.log("File Deleted", path);
        } catch (err) {
          console.log("Error while deleting residual file(s)");
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

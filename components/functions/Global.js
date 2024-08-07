import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import filter from "lodash.filter";
import RNFS from "react-native-fs";
import { showMessage } from "react-native-flash-message";
import * as MailComposer from "expo-mail-composer";
import { Alert, Share } from "react-native";
import * as StoreReview from "expo-store-review";

export async function updateDocuments(dir, setList, setFilteredList, isFolder) {
  const updateCompleteList = [];

  // Check if directory path exists
  if (!(await RNFS.exists(`${RNFS.DocumentDirectoryPath}/${dir}/`)))
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${dir}/`);

  let docs = await FileSystem.readDirectoryAsync(
    `${FileSystem.documentDirectory}${dir}`
  );

  // Push the new documents to the list
  for (const doc of docs) {
    const path = `${FileSystem.documentDirectory}${dir}/${doc}`;
    const docInfo = await FileSystem.getInfoAsync(path);

    updateCompleteList.push(
      new Object({
        name: doc,
        path,
        created: docInfo.modificationTime,
        size: docInfo.size,
        isFolder: isFolder ? true : false,
      })
    );
  }

  // Update UI states
  setList([...updateCompleteList]);
  setFilteredList([...updateCompleteList]);
}

export async function createDirectory(subfolder) {
  if (!(await RNFS.exists(`${RNFS.DocumentDirectoryPath}/${subfolder}/`))) {
    const check = await RNFS.exists(
      `${RNFS.DocumentDirectoryPath}/${subfolder}/`
    );
    console.log(check);
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${subfolder}/`);
  }
}

export async function updateList(
  path,
  setPath,
  setList,
  setFilteredList,
  isFolder
) {
  if (!path) return;

  const updateCompleteList = [];

  // Check if directory path exists
  if (!(await RNFS.exists(path))) RNFS.mkdir(path);

  let docs = await FileSystem.readDirectoryAsync(path);

  // Push the new documents to the list
  for (const doc of docs) {
    const newPath = `${path}/${doc}`;
    const docInfo = await FileSystem.getInfoAsync(newPath);

    setPath(path);

    updateCompleteList.push(
      new Object({
        name: doc,
        path: newPath,
        created: docInfo.modificationTime,
        size: docInfo.size,
        isFolder: isFolder ? true : false,
      })
    );
  }

  // Sort files alphabetically
  updateCompleteList.sort((a, b) =>
    a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  );

  // Sort folders first - unefficient solution
  updateCompleteList.sort(function (a, b) {
    return a.path.includes(".pdf") === true && b.path.includes(".pdf") === false
      ? 1
      : a.path.includes(".pdf") === false && b.path.includes(".pdf") === true
      ? -1
      : 0;
  });

  // Update UI states
  setList([...updateCompleteList]);
  setFilteredList([...updateCompleteList]);
}

export async function createFolder(
  path,
  setPath,
  newFolderName,
  setList,
  setFilteredList
) {
  try {
    if (!path || !newFolderName) throw new Error();

    const newPath = `${path}/${newFolderName}`;
    RNFS.mkdir(newPath);

    updateList(path, setPath, setList, setFilteredList, { isFolder: true });
  } catch (err) {
    showMessage({
      message: "Couldn't create this folder",
      description: err.toString(),
      type: "danger",
      duration: 4000,
    });
  }
}

export async function getFileInfo(path) {
  const infoObj = await FileSystem.getInfoAsync(path);
  return infoObj;
}

export function removeLastFolder(path) {
  const folders = path.split("/");
  folders.pop();
  return folders.join("/");
}

export function getLastFolder(path) {
  const folders = path.split("/");

  // Return the last folder in the array.
  return folders[folders.length - 1];
}

export function getSecondToLastFolderName(path) {
  const folders = path.split("/");

  // Return the second to last folder name.
  return folders[folders.length - 2];
}

export function getLastAndSecondLastFolder(path) {
  console.log("path:", path);
  const folders = path.split("/");

  // Get the last and second to last folders.
  const lastFolder = folders[folders.length - 1];
  const secondLastFolder = folders[folders.length - 2];

  // Return the last and second to last folders.
  return `${secondLastFolder}/${lastFolder}`;
}

export function getPath(subfolder) {
  const path = `${RNFS.DocumentDirectoryPath}/${subfolder}`;

  if (!RNFS.exists(path))
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${subfolder}`);

  return path;
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

// SearchBar functions
export function handleSearch(query, list, updateFilteredList, setSearch) {
  setSearch(query);
  const formattedQuery = query.toLowerCase();

  const filteredData = filter(list, (doc) => {
    return contains(doc, formattedQuery);
  });

  updateFilteredList(filteredData);
}

const contains = ({ name }, query) => {
  if (name.toString().toLowerCase().includes(query)) return true;
  return false;
};

export function clearSearch(setSearch, setFilteredList, list) {
  setSearch("");
  setFilteredList(() => list);
}

export function byteConverter(bytes) {
  const unit = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  if (bytes == 0) return "0 Byte";

  let i = Math.floor(Math.log(bytes) / Math.log(unit));
  let result =
    parseFloat((bytes / Math.pow(unit, i)).toFixed(2)) + " " + sizes[i];

  return result;
}

export function removeExtension(fileName) {
  // Get the index of the last period in the file name.
  const dotIndex = fileName.lastIndexOf(".");

  // If there is no period in the file name, return the original file name.
  if (dotIndex === -1) {
    return fileName;
  }

  // Return the file name without the extension.
  return fileName.substring(0, dotIndex);
}

export function truncate(str, maxLength) {
  if (str.length <= maxLength) {
    return str;
  } else {
    return str.substring(0, maxLength) + "...";
  }
}

async function checkMainService() {
  const canUseMailService = await MailComposer.isAvailableAsync();

  if (canUseMailService === false) {
    showMessage({
      message: "Email Service cannot be used",
      description: "The email cannot be used on this device unfortunately.",
      duration: 3000,
      type: "danger",
    });
    return false;
  }
  return true;
}

export async function sendFeedback() {
  if (!checkMainService) return;

  try {
    await MailComposer.composeAsync({
      subject: "Feedback for SimpleSign",
      recipients: ["zionstudiosapps@gmail.com"],
      body: "Write your feedback or questions here...",
    });
  } catch (err) {
    showMessage({
      message: "Error occurred",
      description: err.toString(),
      duration: 3000,
      type: "danger",
    });
  }
}

export async function reportBug() {
  if (!checkMainService) return;

  try {
    await MailComposer.composeAsync({
      subject: "Report a Bug for SimpleSign",
      recipients: ["zionstudiosapps@gmail.com"],
      body: "Please write a review of the issue/crash that occurred",
    });
  } catch (err) {
    showMessage({
      message: "Error occurred",
      description: err.toString(),
      duration: 3000,
      type: "danger",
    });
  }
}

export const tellFriends = async () => {
  try {
    const result = await Share.share({
      message:
        "Hey check out this e-signature and document scanning app called SimpleSign on the App Store.",
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

export async function openRequestReviewModal() {
  try {
    if (await StoreReview.hasAction()) {
      StoreReview.requestReview();
    }
  } catch (err) {
    showMessage({
      message: "Error occurred",
      description:
        "There was an error which occurred white loading the review modal.",
      duration: 4000,
      type: "danger",
    });
  }
}

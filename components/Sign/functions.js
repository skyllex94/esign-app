import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import RNFS from "react-native-fs";
import { updateDocuments } from "../functions/Global";
import { shareAsync } from "expo-sharing";
import { showMessage } from "react-native-flash-message";
import * as MailComposer from "expo-mail-composer";
import { decode, encode } from "base-64";
import * as DocumentPicker from "expo-document-picker";
import * as Print from "expo-print";

export const selectSignature = async (
  signatureFilePath,
  setShowSignaturePanResponder,
  selectedSignaturePath,
  setSelectedSignaturePath,
  setSignatureArrayBuffer
) => {
  try {
    if (
      selectedSignaturePath === signatureFilePath &&
      selectedSignaturePath !== null &&
      selectedSignaturePath !== undefined
    ) {
      setShowSignaturePanResponder((curr) => !curr);
      return;
    }

    const signatureBase64 = await RNFS.readFile(signatureFilePath, "base64");
    await setSignatureArrayBuffer(base64ToArrayBuffer(signatureBase64));

    await setSelectedSignaturePath(() => signatureFilePath);
    setShowSignaturePanResponder(true);
  } catch (err) {
    console.log("err:", err);
  }
};

export async function selectImage(
  setImagePath,
  setImageArrayBuffer,
  setShowImageSelection
) {
  const pickedDocument = await DocumentPicker.getDocumentAsync({
    type: ["image/jpg", "image/png", "image/bmp", "image/jpeg"],
    copyToCacheDirectory: true, // enabled to be found by FileSystem
  });
  if (pickedDocument.canceled === true) return;

  try {
    const imagePath = pickedDocument.assets[0].uri;

    setImagePath(imagePath);
    const imageBase64 = await RNFS.readFile(imagePath, "base64");
    setImageArrayBuffer(base64ToArrayBuffer(imageBase64));
    setShowImageSelection(true);
  } catch (err) {
    return;
  }
}

export const selectInitials = async (
  path,
  setShowInitials,
  selectedInitialsPath,
  setSelectedInitialsPath,
  setInitialsArrayBuffer
) => {
  if (
    selectedInitialsPath !== null &&
    selectedInitialsPath !== undefined &&
    selectedInitialsPath === path
  ) {
    setShowInitials((curr) => !curr);
    return;
  }

  const initialsBase64 = await RNFS.readFile(path, "base64");

  // Get image ready for being inputted into the pdf document
  await setInitialsArrayBuffer(base64ToArrayBuffer(initialsBase64));

  await setSelectedInitialsPath(() => path);
  setShowInitials(true);
};

export const base64ToArrayBuffer = (base64) => {
  const binary_string = decode(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary_string.charCodeAt(i);

  return bytes;
};

export const deleteSignature = (
  fileWtPath,
  signatureList,
  setSignatureList,
  type
) => {
  return Alert.alert(
    `${type ? "Initials" : "Signature"} Deletion`,
    `Are you sure you want to delete this ${type ? "initial" : "signature"}?`,
    [
      {
        text: "Yes",
        onPress: () => {
          const path = fileWtPath.split("//");
          console.log("path:", path);

          ReactNativeBlobUtil.fs
            .unlink(path[1])
            .then(() => {
              console.log("Deleted File from - ", path[1]);
            })
            .catch((err) => console.log(err));

          // Updating signature array list for the UI
          const updatedSignatureList = signatureList.filter((signature) => {
            console.log("signature", signature);
            return signature !== fileWtPath;
          });

          console.log("updatedSignatureList", updatedSignatureList);

          setSignatureList(updatedSignatureList);
        },
      },

      {
        text: "No",
        onPress: () => {},
      },
    ]
  );
};

export const deleteInitials = (fileWtPath, initialsList, setInitialsList) => {
  return Alert.alert(
    "Initials Deletion",
    "Are you sure you want to delete these initials?",
    [
      {
        text: "Yes",
        onPress: () => {
          const path = fileWtPath.split("//");

          ReactNativeBlobUtil.fs
            .unlink(path[1])
            .then(() => {
              console.log("Deleted File from - ", path[1]);
            })
            .catch((err) => console.log(err));

          // Updating initials array list for the UI
          const updatedInitialsList = initialsList.filter((initials) => {
            return initials !== fileWtPath;
          });

          console.log("updatedInitialsList", updatedInitialsList);

          setInitialsList(updatedInitialsList);
        },
      },

      {
        text: "No",
        onPress: () => {},
      },
    ]
  );
};

export const hideSignatures = (setSignatureList) => {
  setSignatureList(() => []);
};

// Check if directory path exists
export async function directoryExists(subfolder) {
  if (!(await RNFS.exists(`${RNFS.DocumentDirectoryPath}/${subfolder}/`)))
    RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/${subfolder}/`);
}

export async function isFolder(path) {
  const result = await RNFS.exists(path);
  console.log("result:", result);
  if (result) {
    const readFile = await RNFS.readDir();
    const isFolder = readFile.isDirectory();
    if (isFolder === true) return true;

    return false;
  }
}

export async function loadStoredSignatures(setSignatureList) {
  const updatedSignatureList = [];

  directoryExists("Signatures");

  let dir = await FileSystem.readDirectoryAsync(
    FileSystem.documentDirectory + "Signatures"
  );

  dir.forEach((val) => {
    updatedSignatureList.push(
      FileSystem.documentDirectory + "Signatures/" + val
    );
  });

  setSignatureList([...updatedSignatureList]);
}

export async function loadStoredInitials(setInitialsList) {
  const updatedInitialsList = [];

  directoryExists("Initials");

  let dir = await FileSystem.readDirectoryAsync(
    FileSystem.documentDirectory + "Initials"
  );

  dir.forEach((val) => {
    updatedInitialsList.push(FileSystem.documentDirectory + "Initials/" + val);
  });

  setInitialsList([...updatedInitialsList]);
}

export const uint8ToBase64Conversion = (u8Arr) => {
  const CHUNK_SIZE = 0x8000; // arbitrary number
  let index = 0;
  const length = u8Arr.length;
  let result = "";
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return encode(result);
};

export const deleteDocument = (
  fileWtPath,
  docList,
  setDocList,
  setFilteredDocList,
  navigation
) => {
  return Alert.alert(
    "Document Deletion",
    "Are you sure you want to delete this signed document?",
    [
      {
        text: "Yes",
        onPress: () => {
          const path = fileWtPath.split("//")[1];
          console.log("path:", path);

          ReactNativeBlobUtil.fs
            .unlink(path)
            .then(() => {
              console.log("Deleted File from - ", path);
            })
            .catch((err) => console.log(err));

          // Updating signature array list for the UI
          const updatedDocList = docList.filter((doc) => doc !== fileWtPath);

          setDocList(updatedDocList);
          updateDocuments("Completed", setDocList, setFilteredDocList);
          setTimeout(() => {
            navigation.goBack();
          }, 1000);
        },
      },

      {
        text: "No",
        onPress: () => {},
      },
    ]
  );
};

export async function openShareOptions(path) {
  await shareAsync(path, {
    UTI: ".pdf",
    mimeType: "application/pdf",
  });
}

export async function emailDocument(docPath) {
  const canUseMailService = await MailComposer.isAvailableAsync();

  if (canUseMailService === false) {
    showMessage({
      message: "Email Service cannot be used",
      description: "The email cannot be used on this device unfortunately.",
      duration: 3000,
      type: "danger",
    });
    return;
  }

  try {
    await MailComposer.composeAsync({
      subject: "Document to be Signed",
      body: "Here's the signed document for you to review/have. Signed via SimpleSign™.",
      attachments: docPath,
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

export async function emailToThirdParty(docPath, fileName) {
  const canUseMailService = await MailComposer.isAvailableAsync();

  if (canUseMailService === false) {
    showMessage({
      message: "Email Service cannot be used",
      description: "The email cannot be used on this device unfortunately.",
      duration: 3000,
      type: "danger",
    });
    return;
  }

  try {
    await MailComposer.composeAsync({
      subject: `Signed Document`,
      body: `Here's the signed document - ${fileName} for you to review/have. Signed via SimpleSign™.`,
      attachments: docPath,
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

export async function printDocument(docPath, selectedPrinter) {
  return Alert.alert(
    `Print Document`,
    `This will print unedited version of the document. Are you sure you want to print?`,
    [
      {
        text: "Yes",
        onPress: async () => {
          try {
            // Print the document
            const { uri } = await Print.printAsync({
              uri: docPath,
              printerUrl: selectedPrinter?.url,
            });
            console.log("File has been saved to:", uri);
          } catch (err) {
            // Leaving it empty since cancel triggers a warning
          }
        },
      },

      {
        text: "No",
        onPress: () => {},
      },
    ]
  );
}

export async function selectPrinter(setSelectedPrinter) {
  try {
    const printer = await Print.selectPrinterAsync();
    setSelectedPrinter(printer);
  } catch (err) {
    // Leaving reporting empty since cancel triggers a warning
  }
}

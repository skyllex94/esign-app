import { encode } from "base-64";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import RNFS from "react-native-fs";
import { updateDocuments } from "../functions/Global";
import { shareAsync } from "expo-sharing";
import { showMessage } from "react-native-flash-message";
import * as MailComposer from "expo-mail-composer";

export const selectSignature = async (
  signatureFilePath,
  setInputSignature,
  selectedSignaturePath,
  setSelectedSignaturePath,
  setSignatureBase64Data
) => {
  const signatureBase64 = await RNFS.readFile(signatureFilePath, "base64");
  setSignatureBase64Data(signatureBase64);

  if (selectedSignaturePath == signatureFilePath)
    setInputSignature((curr) => !curr);
  else {
    setSelectedSignaturePath(() => signatureFilePath);
    setInputSignature(true);
  }
};

export const deleteSignature = (
  fileWtPath,
  signatureList,
  setSignatureList
) => {
  return Alert.alert(
    "Signature Deletion",
    "Are you sure you want to delete this signature?",
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

export const hideSignatures = (setSignatureList) => {
  setSignatureList(() => []);
};

export async function loadStoredSignatures(setSignatureList) {
  const updatedSignatureList = [];

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
          updateDocuments(setDocList, setFilteredDocList);
          setTimeout(() => {
            navigation.navigate("Main");
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
      message: "Error Occured",
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
      message: "Error Occured",
      description: err.toString(),
      duration: 3000,
      type: "danger",
    });
  }
}

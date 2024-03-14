import { encode } from "base-64";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import RNFS from "react-native-fs";
import { updateDocuments } from "../functions/Global";

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

export async function displayStoredSignatures(setSignatureList) {
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

export const deleteDocument = (fileWtPath, docList, setDocList, navigation) => {
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

          console.log("docList", docList);

          // Updating signature array list for the UI
          const updatedDocList = docList.filter((doc) => doc !== fileWtPath);

          setDocList(updatedDocList);
          updateDocuments(setDocList);
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

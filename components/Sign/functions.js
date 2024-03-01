import { encode } from "base-64";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import ReactNativeBlobUtil from "react-native-blob-util";
import RNFS from "react-native-fs";

export const selectSignature = async (
  signatureFilePath,
  setInputSignature,
  setSelectedSignaturePath,
  setSignatureBase64Data
) => {
  // const info = await FileSystem.getInfoAsync(signatureFilePath);
  // ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
  // alert(info.uri);
  // navigation.navigate("DragSignature");

  const signatureBase64 = await RNFS.readFile(signatureFilePath, "base64");
  setSignatureBase64Data(signatureBase64);

  setSelectedSignaturePath(() => signatureFilePath);
  setInputSignature((curr) => !curr);
};

export const deleteSignature = (
  fileWtPath,
  signatureList,
  setSignatureList
) => {
  return Alert.alert(
    "Are your sure?",
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

          console.log("signatureList", signatureList);

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

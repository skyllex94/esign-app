import * as FileSystem from "expo-file-system";
import ReactNativeBlobUtil from "react-native-blob-util";

export const selectSignature = async (
  signatureFilePath,
  navigation,
  setInputSignature
) => {
  console.log("setInputSignature:", setInputSignature);
  // const info = await FileSystem.getInfoAsync(signatureFilePath);
  // ReactNativeBlobUtil.ios.openDocument(signatureFilePath);
  // alert(info.uri);
  // navigation.navigate("DragSignature");

  setInputSignature((curr) => !curr);
};

export const deleteSignature = (
  fileWtPath,
  signatureList,
  setSignatureList
) => {
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

  // return Alert.alert(
  //   "Are your sure?",
  //   "Are you sure you want to delete this signature?",
  //   [
  //     // The "Yes" button
  //     {
  //       text: "Yes",
  //       onPress: () => {

  //       },
  //     },

  //     {
  //       text: "No",
  //     },
  //   ]
  // );
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

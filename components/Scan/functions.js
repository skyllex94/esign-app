import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import RNFS from "react-native-fs";
import { updateList } from "../functions/Global";
import { showMessage } from "react-native-flash-message";
import * as MailComposer from "expo-mail-composer";
import { shareAsync } from "expo-sharing";

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

export const deleteDocument = (
  path,
  scanPath,
  setScanPath,
  setScanList,
  setFilteredScanList,
  navigation
) => {
  return Alert.alert(
    "Document Deletion",
    "Are you sure you want to delete this scanned document?",
    [
      {
        text: "Yes",
        onPress: () => {
          console.log("path:", path);

          RNFS.unlink(path)
            .then(() => {
              console.log("Deleted File from - ", path);
            })
            .catch((err) => console.log(err));

          updateList(scanPath, setScanPath, setScanList, setFilteredScanList);

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

export async function emailRequest({
  recipientEmail,
  recipientName,
  documentName,
}) {
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
      recipients: [recipientEmail],
      subject: `Requesting ${documentName}`,
      body:
        `Hello ${recipientName},` +
        "\n" +
        "\n" +
        `I hope this email finds you well. I am writing to kindly request a document from you.` +
        "\n" +
        `Would it be possible for you to send the ${documentName} at your earliest convenience? ` +
        `Your assistance in this matter would be greatly appreciated.I would like to obtain it for signature and further editing.` +
        "\n" +
        "\n" +
        "Thank you very much for your attention to this request. I look forward to receiving the document from you soon.",
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
      subject: "Scanned Document",
      body: "Here's the scanned document for you to review/have. Scanned via SimpleSign™.",
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
      subject: `Scanned Document`,
      body: `Here's the scanned document - ${fileName} for you to review/have. Scanned via SimpleSign™.`,
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

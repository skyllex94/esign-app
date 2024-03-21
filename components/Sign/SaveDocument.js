import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
// UI
import { TextInput, Dimensions } from "react-native";
import { Context } from "../contexts/Global";
import { updateDocuments } from "../functions/Global";
import { actionButton } from "../../constants/UI";
import { PDFDocument } from "pdf-lib";
import { uint8ToBase64Conversion } from "./functions";
import RNFS from "react-native-fs";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";
// import { BlurView } from "expo-blur";

export const SaveDocument = ({
  isNamingModal,
  setIsNamingModal,
  currPage,
  widthElement,
  heightElement,
  pageWidth,
  pageHeight,
  elementSizeWidth,
  setEditedPdfPath,
  setPdfBase64,
  signatureArrayBuffer,
  pdfArrayBuffer,
  navigation,
  editingPalette,
}) => {
  const renameRef = useRef();
  const animation = useRef();
  const [newName, setNewName] = useState(null);
  const { setDocList, setFilteredDocList, bottomSheetChooseDocument } =
    useContext(Context);
  const [savingInProgress, setSavingInProgress] = useState(false);

  useEffect(() => {
    // Auto focus on the rename field
    renameRef.current.focus();
  }, []);

  async function saveSignedDocument() {
    setSavingInProgress(true);
    // TODO: Work of encrypted pdf files
    const pdfDoc = await PDFDocument.load(pdfArrayBuffer);

    const pages = pdfDoc.getPages();
    console.log("pages:", pages);
    const firstPage = pages[currPage - 1];

    // Inputting the signature inside the PDF document
    if (signatureArrayBuffer) {
      const signatureImage = await pdfDoc.embedPng(signatureArrayBuffer);

      console.log(widthElement, heightElement);

      firstPage.drawImage(signatureImage, {
        x: (pageWidth * (widthElement - 120)) / Dimensions.get("window").width,
        y: pageHeight - (pageHeight * (heightElement + 25)) / 540,
        width: elementSizeWidth + 50,
        height: elementSizeWidth + 25,
      });

      // Saving the new editted document
      const pdfEditedBytes = await pdfDoc.save();
      const pdfBase64 = uint8ToBase64Conversion(pdfEditedBytes);
      // console.log("pdfBase64:", pdfBase64);

      const editedDocPath = `${RNFS.DocumentDirectoryPath}/Completed/${newName}.pdf`;
      console.log("editedDocPath", editedDocPath);

      const existsPath = await RNFS.exists(
        `${RNFS.DocumentDirectoryPath}/Completed/`
      );

      // Make directory path if none exists
      if (!existsPath) RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/Completed/`);

      try {
        await RNFS.writeFile(editedDocPath, pdfBase64, "base64");

        setEditedPdfPath(editedDocPath);
        setPdfBase64(pdfBase64);

        console.log("Success, you have your newly edited document");
        editingPalette.current.close();
        bottomSheetChooseDocument.current.close();
        await setIsNamingModal(false);

        navigation.navigate("DocumentSuccess", { editedDocPath });
        updateDocuments(setDocList, setFilteredDocList);
      } catch (err) {
        showMessage({
          message: "Error Occured",
          description: err.toString(),
          duration: 3000,
          type: "danger",
        });
      }
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isNamingModal}
      onRequestClose={() => setIsNamingModal((curr) => !curr)}
    >
      <View className="flex-1 justify-center items-center">
        <View
          className="m-8 bg-white rounded-lg p-5 shadow"
          style={styles.modalView}
        >
          <View className="flex-row items-center justify-between mb-3 w-full">
            <Text className="mr-6 text-[16px]">Save Signed Document</Text>
            <TouchableOpacity
              className={`bg-[#e6867a] rounded-full p-2`}
              onPress={() => setIsNamingModal((curr) => !curr)}
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {!savingInProgress ? (
            <View>
              <View className="flex-row items-center justify-between my-2 w-full">
                <TextInput
                  ref={renameRef}
                  placeholder="Document Name"
                  onChangeText={(text) => setNewName(text)}
                  className="h-12 px-2 w-full rounded-lg border-2 border-gray-600"
                />
              </View>

              <View className="flex-row items-center justify-between my-3 w-full">
                <TouchableOpacity
                  onPress={() => saveSignedDocument()}
                  className={`rounded-lg bg-[${actionButton}] py-3 px-10`}
                >
                  <Text className="text-[16px] text-white">Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsNamingModal(false)}
                  className={`rounded-lg bg-slate-200 py-3 px-6`}
                >
                  <Text className="text-[16px]">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <LottieView
              autoPlay
              ref={animation}
              style={{ width: 100, height: 100 }}
              source={require("../../assets/lottie/progress.json")}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

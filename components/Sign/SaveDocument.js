import { AntDesign } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
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

export const SaveDocument = ({
  isNamingModal,
  setIsNamingModal,
  currPage,
  coordinateX,
  coordinateY,
  pageRatio,
  pdfWidth,
  pdfHeight,
  diffInDisplays,
  elementSizeWidth,
  elementSizeHeight,
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

  // console.log(diplayWidth, displayHeight);
  // console.log("x_save: ", coordinateX, "y_save: ", coordinateY);
  // console.log("pdf_height: ", pdfHeight, "pdf_width: ", pdfWidth);

  async function saveSignedDocument() {
    let pdfDoc = null;

    try {
      setSavingInProgress(true);
    } catch (err) {}

    // Encrypted document check-up
    // TODO: Work of encrypted pdf files
    try {
      pdfDoc = await PDFDocument.load(pdfArrayBuffer);
    } catch (err) {
      console.log(err.toString().includes("encrypted"));

      if (err.toString().includes("encrypted"))
        showMessage({
          message: "Error Occured",
          description:
            "The document you are trying to load is encrypted. Unfortunately, we cannot save this.",
          duration: 6000,
          type: "danger",
        });
      return setIsNamingModal(false);
    }

    try {
      // The x-coordinate anchor point for signature inputted
      const x = (pdfWidth * coordinateX) / Dimensions.get("window").width;

      // The y-coordinate anchor point for the signature to be inputted
      // Starting from the bottom so it should be divided on itself
      const y =
        pdfHeight -
        (pdfHeight * (coordinateY + elementSizeWidth - 10)) /
          (Dimensions.get("window").width * pageRatio).toFixed(2);

      const pages = pdfDoc.getPages();
      console.log("pages:", pages);
      const firstPage = pages[currPage - 1];

      // Inputting the signature inside the PDF document
      if (signatureArrayBuffer) {
        const signatureImage = await pdfDoc.embedPng(signatureArrayBuffer);

        firstPage.drawImage(signatureImage, {
          x,
          y,
          width: elementSizeWidth * diffInDisplays,
          height: elementSizeHeight * diffInDisplays,
        });

        // Saving the new editted document
        const pdfEditedBytes = await pdfDoc.save();
        const pdfBase64 = uint8ToBase64Conversion(pdfEditedBytes);

        // Check if directory path exists
        if (!(await RNFS.exists(`${RNFS.DocumentDirectoryPath}/Completed/`)))
          RNFS.mkdir(`${RNFS.DocumentDirectoryPath}/Completed/`);

        const editedDocPath = `${
          RNFS.DocumentDirectoryPath
        }/Completed/${newName.trim()}.pdf`;

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
    } catch (err) {
      showMessage({
        message: "Error While Saving Document",
        description: err.toString(),
        duration: 3000,
        type: "danger",
      });
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isNamingModal}
      onRequestClose={() => setIsNamingModal((curr) => !curr)}
    >
      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setIsNamingModal(false);
        }}
      />

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

      <TouchableOpacity
        className="flex-1"
        onPress={() => {
          setIsNamingModal(false);
        }}
      />
    </Modal>
  );
};

export default SaveDocument;

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

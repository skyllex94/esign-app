import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
// UI
import { TextInput, Dimensions } from "react-native";
import { Context } from "../contexts/Global";
import { updateDocuments } from "../functions/Global";
import { actionButton } from "../../constants/UI";
import { PDFDocument, PDFFont, StandardFonts } from "pdf-lib";
import { uint8ToBase64Conversion } from "./functions";
import RNFS from "react-native-fs";
import LottieView from "lottie-react-native";
import { showMessage } from "react-native-flash-message";

export const SaveDocument = ({
  isNamingModal,
  setIsNamingModal,
  showSignaturePanResponder,
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
  // Date props
  date,
  date_x,
  date_y,
  dateSize,
  showDatePanResponder,
  // Initials props
  showInitials,
  initialsX,
  initialsY,
  initialsWidthSize,
  initialsHeightSize,
  initialsArrayBuffer,
  // Image props
  showImageSelection,
  imageX,
  imageY,
  imageWidth,
  imageHeight,
  imageArrayBuffer,
  // Text props
  text,
  showText,
  textPositionX,
  textPositionY,
  textSize,
  // Checkbox props
  showCheckbox,
  checkboxPositionX,
  checkboxPositionY,
  checkboxSize,
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
    let pdfDoc = null;
    setSavingInProgress(true);

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

    // If there is a signature to be chosen
    if (showSignaturePanResponder === true) {
      try {
        // The x-coordinate anchor point for signature inputted
        const x = (pdfWidth * coordinateX) / Dimensions.get("window").width;

        // The y-coordinate anchor point for the signature to be inputted
        // Starting from the bottom so it should be divided on itself
        const y =
          pdfHeight -
          (pdfHeight * (coordinateY + elementSizeHeight)) /
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

    if (showDatePanResponder === true) {
      try {
        // The x-coordinate anchor point for signature inputted
        const x = (pdfWidth * date_x) / Dimensions.get("window").width;

        // The y-coordinate anchor point for the signature to be inputted
        // Starting from the bottom so it should be divided on itself
        const y =
          pdfHeight -
          (pdfHeight * (date_y + dateSize)) /
            (Dimensions.get("window").width * pageRatio).toFixed(2);

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pages = pdfDoc.getPages();

        // Input the date in the designated place
        const selectedPage = pages[currPage - 1];
        selectedPage.drawText(date, {
          x,
          y,
          font,
          size: dateSize * diffInDisplays,
        });
      } catch (err) {
        showMessage({
          message: "Error while saving date",
          description: err.toString(),
          duration: 3000,
          type: "danger",
        });
      }
    }

    if (showInitials === true) {
      try {
        // The x-coordinate anchor point for signature inputted
        const x = (pdfWidth * initialsX) / Dimensions.get("window").width;

        // The y-coordinate anchor point for the signature to be inputted
        // Starting from the bottom so it should be divided on itself
        const y =
          pdfHeight -
          (pdfHeight * (initialsY + initialsWidthSize - 10)) /
            (Dimensions.get("window").width * pageRatio).toFixed(2);

        const pages = pdfDoc.getPages();
        const selectedPage = pages[currPage - 1];

        // Inputting the signature inside the PDF document
        if (initialsArrayBuffer) {
          const initialsFile = await pdfDoc.embedPng(initialsArrayBuffer);

          selectedPage.drawImage(initialsFile, {
            x,
            y,
            width: initialsWidthSize * diffInDisplays,
            height: initialsHeightSize * diffInDisplays,
          });
        }
      } catch (err) {
        showMessage({
          message: "Error While Saving Initials",
          description: err.toString(),
          duration: 3000,
          type: "danger",
        });
      }
    }

    if (showImageSelection === true) {
      try {
        // The x-coordinate anchor point for signature inputted
        const x = (pdfWidth * imageX) / Dimensions.get("window").width;

        // The y-coordinate anchor point for the signature to be inputted
        // Starting from the bottom so it should be divided on itself
        const y =
          pdfHeight -
          (pdfHeight * (imageY + imageHeight)) /
            (Dimensions.get("window").width * pageRatio).toFixed(2);

        const pages = pdfDoc.getPages();
        const selectedPage = pages[currPage - 1];

        // Inputting the signature inside the PDF document
        if (imageArrayBuffer) {
          const imageFile = await pdfDoc.embedPng(imageArrayBuffer);

          selectedPage.drawImage(imageFile, {
            x,
            y,
            width: imageWidth * diffInDisplays,
            height: imageHeight * diffInDisplays,
          });
        }
      } catch (err) {
        showMessage({
          message: "Error while saving image",
          description: err.toString(),
          duration: 3000,
          type: "danger",
        });
      }
    }

    if (showText === true) {
      try {
        const x = (pdfWidth * textPositionX) / Dimensions.get("window").width;

        const y =
          pdfHeight -
          (pdfHeight * (textPositionY + dateSize)) /
            (Dimensions.get("window").width * pageRatio).toFixed(2);

        const size = textSize * diffInDisplays;

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pages = pdfDoc.getPages();
        const selectedPage = pages[currPage - 1];

        // Input the date in the designated place
        selectedPage.drawText(text, { x, y, font, size });
      } catch (err) {
        showMessage({
          message: "Error while saving custom text",
          description: err.toString(),
          duration: 3000,
          type: "danger",
        });
      }
    }

    if (showCheckbox === true) {
      try {
        const x =
          (pdfWidth * checkboxPositionX) / Dimensions.get("window").width;

        const y =
          pdfHeight -
          (pdfHeight * (checkboxPositionY + checkboxSize)) /
            (Dimensions.get("window").width * pageRatio).toFixed(2);

        const pages = pdfDoc.getPages();
        const selectedPage = pages[currPage - 1];

        const form = pdfDoc.getForm();
        const checkbox = form.createCheckBox("checkbox_field");
        checkbox.check();

        checkbox.addToPage(selectedPage, {
          x,
          y,
          width: checkboxSize,
          height: checkboxSize,
        });
      } catch (err) {
        showMessage({
          message: "Error while saving checkbox",
          description: err.toString(),
          duration: 8000,
          type: "danger",
        });
      }
    }

    // Saving the new editted document
    try {
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
    } catch (err) {
      showMessage({
        message: "Error while finishing",
        description: err.toString(),
        duration: 3000,
        type: "danger",
      });
    }

    setSavingInProgress(false);
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
